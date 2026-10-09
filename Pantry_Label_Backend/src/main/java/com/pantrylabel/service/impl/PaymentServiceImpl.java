package com.pantrylabel.service.impl;

import com.pantrylabel.dto.request.PaymentVerifyRequest;
import com.pantrylabel.entity.Order;
import com.pantrylabel.entity.Payment;
import com.pantrylabel.exception.PaymentVerificationException;
import com.pantrylabel.exception.ResourceNotFoundException;
import com.pantrylabel.repository.OrderRepository;
import com.pantrylabel.repository.PaymentRepository;
import com.pantrylabel.service.NotificationService;
import com.pantrylabel.service.PaymentService;
import com.pantrylabel.util.HmacUtil;
import com.razorpay.RazorpayClient;
import java.util.LinkedHashMap;
import java.util.Map;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpay;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final HmacUtil hmac;
    private final NotificationService notifications;
    private final String keyId;
    private final String keySecret;

    public PaymentServiceImpl(RazorpayClient razorpay,
                              OrderRepository orders,
                              PaymentRepository payments,
                              HmacUtil hmac,
                              NotificationService notifications,
                              @Value("${app.razorpay.key-id}") String keyId,
                              @Value("${app.razorpay.key-secret}") String keySecret) {
        this.razorpay = razorpay;
        this.orders = orders;
        this.payments = payments;
        this.hmac = hmac;
        this.notifications = notifications;
        this.keyId = keyId;
        this.keySecret = keySecret;
    }

    @Override
    @Transactional
    public Map<String, Object> createRazorpayOrder(String email, Long orderId) {
        if (keyId == null || keyId.isBlank() || "rzp_test_placeholder".equalsIgnoreCase(keyId)
                || keySecret == null || keySecret.isBlank() || "placeholder_secret".equalsIgnoreCase(keySecret)) {
            throw new IllegalStateException("Razorpay TEST credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
        }

        Order order = orders.findById(orderId)
                .filter(value -> value.getUser().getEmail().equals(email))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new IllegalArgumentException("Order is not awaiting payment");
        }

        try {
            Payment payment = payments.findByOrderId(orderId).orElse(null);
            if (payment != null && "PENDING".equals(payment.getStatus()) && payment.getRazorpayOrderId() != null) {
                try {
                    com.razorpay.Order existingOrder = razorpay.orders.fetch(payment.getRazorpayOrderId());
                    if (existingOrder != null && "created".equalsIgnoreCase(existingOrder.get("status"))) {
                        Map<String, Object> response = new LinkedHashMap<>();
                        response.put("id", existingOrder.get("id"));
                        response.put("keyId", keyId);
                        response.put("razorpayOrderId", existingOrder.get("id"));
                        response.put("amount", existingOrder.get("amount"));
                        response.put("currency", existingOrder.get("currency"));
                        return response;
                    }
                } catch (Exception ex) {
                    // Gateway order retrieval failed or expired, create new order below
                }
            }

            JSONObject request = new JSONObject();
            request.put("amount", order.getGrandTotal().movePointRight(2).longValueExact());
            request.put("currency", "INR");
            request.put("receipt", "order_" + order.getId());
            com.razorpay.Order gatewayOrder = razorpay.orders.create(request);

            if (payment == null) {
                payment = Payment.builder().order(order).build();
            }
            payment.setRazorpayOrderId(gatewayOrder.get("id"));
            payment.setStatus("PENDING");
            payments.save(payment);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("id", gatewayOrder.get("id"));
            response.put("keyId", keyId);
            response.put("razorpayOrderId", gatewayOrder.get("id"));
            response.put("amount", gatewayOrder.get("amount"));
            response.put("currency", gatewayOrder.get("currency"));
            return response;
        } catch (ResourceNotFoundException | IllegalArgumentException | IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalStateException("Could not create Razorpay order: " + ex.getMessage(), ex);
        }
    }

    @Override
    @Transactional(noRollbackFor = PaymentVerificationException.class)
    public void verify(String email, PaymentVerifyRequest request) {
        if (keySecret == null || keySecret.isBlank() || "placeholder_secret".equalsIgnoreCase(keySecret)) {
            throw new PaymentVerificationException("Razorpay TEST secret is not configured.");
        }

        Payment payment = payments.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new PaymentVerificationException("Payment order not found"));

        if (!payment.getOrder().getUser().getEmail().equals(email)) {
            throw new PaymentVerificationException("Payment does not belong to the current user");
        }

        if (!hmac.matches(request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature(), keySecret)) {
            payment.setStatus("FAILED");
            payments.save(payment);
            throw new PaymentVerificationException("Invalid payment signature");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus("COMPLETED");
        payment.getOrder().setStatus("PAID");
        payments.save(payment);

        notifications.sendOrderConfirmation(email, payment.getOrder());
    }
}
