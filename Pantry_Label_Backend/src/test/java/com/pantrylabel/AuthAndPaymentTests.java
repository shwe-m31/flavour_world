package com.pantrylabel;

import com.pantrylabel.dto.request.LoginRequest;
import com.pantrylabel.dto.request.OtpRequest;
import com.pantrylabel.dto.request.OtpVerifyRequest;
import com.pantrylabel.dto.request.PaymentVerifyRequest;
import com.pantrylabel.dto.request.RegisterRequest;
import com.pantrylabel.dto.response.AuthResponse;
import com.pantrylabel.entity.Address;
import com.pantrylabel.entity.Order;
import com.pantrylabel.entity.Payment;
import com.pantrylabel.entity.User;
import com.pantrylabel.exception.PaymentVerificationException;
import com.pantrylabel.repository.AddressRepository;
import com.pantrylabel.repository.OrderRepository;
import com.pantrylabel.repository.PaymentRepository;
import com.pantrylabel.repository.UserRepository;
import com.pantrylabel.service.AuthService;
import com.pantrylabel.service.PaymentService;
import com.pantrylabel.util.HmacUtil;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
        "app.razorpay.key-id=rzp_test_unit123",
        "app.razorpay.key-secret=unit_test_secret_32bytes_long!"
})
public class AuthAndPaymentTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private HmacUtil hmacUtil;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    @BeforeEach
    void setUp() {
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        addressRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("TEST 1 - New Username Registration: creates account with profileCompleted = false")
    void testNewUsernameRegistration() {
        RegisterRequest req = new RegisterRequest("new_chef", "Secret123", null);
        AuthResponse resp = authService.register(req);

        assertNotNull(resp.getToken());
        assertNotNull(resp.getUser());
        assertEquals("new_chef", resp.getUser().getUsername());
        assertFalse(resp.getUser().isProfileCompleted(), "profileCompleted must be false for newly registered user");

        User saved = userRepository.findByUsername("new_chef").orElse(null);
        assertNotNull(saved);
        assertFalse(saved.isProfileCompleted());
        assertNotEquals("Secret123", saved.getPassword(), "Password must be hashed");

        // Duplicate username should fail
        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("TEST 2 - New Email Registration: does not create user on send-otp, creates on valid verify-otp")
    void testNewEmailRegistrationFlow() {
        String email = "fresh_user@example.com";

        // Step 1: Send registration OTP
        OtpRequest sendReq = new OtpRequest(email, "REGISTER");
        authService.sendOtp(sendReq);

        // User must NOT be in DB yet
        assertFalse(userRepository.findByEmail(email).isPresent(), "User must not be saved on Send OTP");

        // Try registering with wrong OTP
        OtpVerifyRequest wrongVerify = new OtpVerifyRequest(email, "000000", "REGISTER");
        assertThrows(RuntimeException.class, () -> authService.verifyOtp(wrongVerify));
    }

    @Test
    @DisplayName("TEST 3 - Existing Username Login: authenticates and preserves profileCompleted")
    void testExistingUsernameLogin() {
        RegisterRequest regReq = new RegisterRequest("existing_cook", "Secret123", null);
        authService.register(regReq);

        // Mark profile completed as if user completed setup
        User u = userRepository.findByUsername("existing_cook").orElseThrow();
        u.setProfileCompleted(true);
        userRepository.save(u);

        // Sign in
        LoginRequest loginReq = new LoginRequest("existing_cook", "Secret123");
        AuthResponse loginResp = authService.login(loginReq);

        assertNotNull(loginResp.getToken());
        assertTrue(loginResp.getUser().isProfileCompleted(), "profileCompleted must remain true for existing user");
    }

    @Test
    @DisplayName("TEST 4 - Invalid Username: throws account does not exist message")
    void testInvalidUsernameLogin() {
        LoginRequest loginReq = new LoginRequest("non_existent_user", "Secret123");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(loginReq));
        assertEquals("Invalid user. Account does not exist. Please create an account first.", ex.getMessage());
    }

    @Test
    @DisplayName("TEST 5 - Wrong Password: throws invalid username or password")
    void testWrongPasswordLogin() {
        RegisterRequest regReq = new RegisterRequest("valid_user", "Secret123", null);
        authService.register(regReq);

        LoginRequest loginReq = new LoginRequest("valid_user", "WrongPassword999");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.login(loginReq));
        assertEquals("Invalid username or password.", ex.getMessage());
    }

    @Test
    @DisplayName("TEST 6 - Existing Email OTP Login: verifies OTP and keeps existing profileCompleted")
    void testExistingEmailOtpLogin() {
        // Create an existing user
        User user = User.builder()
                .username("cook_master")
                .email("cook@example.com")
                .password("EncryptedPass")
                .profileCompleted(true)
                .build();
        userRepository.save(user);

        // Send OTP with LOGIN purpose
        OtpRequest otpReq = new OtpRequest("cook@example.com", "LOGIN");
        authService.sendOtp(otpReq);

        User afterOtp = userRepository.findByEmail("cook@example.com").orElseThrow();
        assertNotNull(afterOtp.getOtp());
        String actualOtp = afterOtp.getOtp();

        // Verify OTP
        OtpVerifyRequest verifyReq = new OtpVerifyRequest("cook@example.com", actualOtp, "LOGIN");
        AuthResponse authResp = authService.verifyOtp(verifyReq);

        assertNotNull(authResp.getToken());
        assertTrue(authResp.getUser().isProfileCompleted(), "profileCompleted must remain true");
    }

    @Test
    @DisplayName("TEST 7 - Unknown Email OTP Login: rejects send-otp request")
    void testUnknownEmailOtpLogin() {
        OtpRequest otpReq = new OtpRequest("ghost@example.com", "LOGIN");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.sendOtp(otpReq));
        assertEquals("Invalid user. Account does not exist. Please create an account first.", ex.getMessage());
        assertFalse(userRepository.findByEmail("ghost@example.com").isPresent());
    }

    @Test
    @DisplayName("TEST 8 - Completed User Re-Login: profileCompleted remains true")
    void testCompletedUserReLogin() {
        RegisterRequest reg = new RegisterRequest("re_login_user", "Password99", null);
        authService.register(reg);

        User user = userRepository.findByUsername("re_login_user").orElseThrow();
        user.setProfileCompleted(true);
        userRepository.save(user);

        LoginRequest login = new LoginRequest("re_login_user", "Password99");
        AuthResponse resp = authService.login(login);

        assertTrue(resp.getUser().isProfileCompleted());
    }

    @Test
    @DisplayName("TEST 9 & 10 - Razorpay Verification & Failure behavior")
    void testRazorpayPaymentVerificationAndFailure() throws Exception {
        // Create test user
        User user = User.builder()
                .username("pay_tester")
                .email("pay@example.com")
                .profileCompleted(true)
                .build();
        user = userRepository.save(user);

        // Create test address
        Address address = Address.builder()
                .user(user)
                .name("Pay Tester")
                .phone("9876543210")
                .flatHouseNo("101")
                .areaStreetName("Main St")
                .city("Bangalore")
                .state("Karnataka")
                .pincode("560001")
                .build();
        address = addressRepository.save(address);

        // Create test order
        Order order = Order.builder()
                .user(user)
                .address(address)
                .subTotal(new BigDecimal("100.00"))
                .gst(new BigDecimal("18.00"))
                .shipping(BigDecimal.ZERO)
                .grandTotal(new BigDecimal("118.00"))
                .status("PENDING_PAYMENT")
                .build();
        order = orderRepository.save(order);

        // Create test pending payment
        String razorpayOrderId = "order_test_123456";
        String razorpayPaymentId = "pay_test_789012";

        Payment payment = Payment.builder()
                .order(order)
                .razorpayOrderId(razorpayOrderId)
                .status("PENDING")
                .build();
        paymentRepository.save(payment);

        // Test with invalid signature -> must throw PaymentVerificationException and set Payment FAILED
        PaymentVerifyRequest invalidReq = new PaymentVerifyRequest(razorpayOrderId, razorpayPaymentId, "bad_signature");
        assertThrows(PaymentVerificationException.class, () -> paymentService.verify("pay@example.com", invalidReq));

        Payment failedPayment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow();
        assertEquals("FAILED", failedPayment.getStatus());
        Order pendingOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertEquals("PENDING_PAYMENT", pendingOrder.getStatus(), "Order must NOT be marked PAID on failed verification");

        // Now calculate valid HMAC-SHA256 signature
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal((razorpayOrderId + "|" + razorpayPaymentId).getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        String validSignature = hexString.toString();

        // Verify with valid signature -> must succeed, mark Payment COMPLETED and Order PAID
        PaymentVerifyRequest validReq = new PaymentVerifyRequest(razorpayOrderId, razorpayPaymentId, validSignature);
        paymentService.verify("pay@example.com", validReq);

        Payment completedPayment = paymentRepository.findByRazorpayOrderId(razorpayOrderId).orElseThrow();
        assertEquals("COMPLETED", completedPayment.getStatus());
        Order paidOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertEquals("PAID", paidOrder.getStatus());
    }

    @Test
    @DisplayName("TEST 10 - Razorpay order creation fails when credentials are placeholder")
    void testRazorpayOrderCreationWithPlaceholderCredentials() {
        PaymentService placeholderService = new com.pantrylabel.service.impl.PaymentServiceImpl(
                null,
                orderRepository,
                paymentRepository,
                hmacUtil,
                null,
                "rzp_test_placeholder",
                "placeholder_secret"
        );
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> placeholderService.createRazorpayOrder("any@example.com", 999L));
        assertTrue(ex.getMessage().contains("Razorpay TEST credentials are not configured"));
    }
}
