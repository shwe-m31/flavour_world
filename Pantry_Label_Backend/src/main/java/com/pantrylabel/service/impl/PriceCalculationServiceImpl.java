package com.pantrylabel.service.impl;
import com.pantrylabel.entity.Cart;
import com.pantrylabel.service.PriceCalculationService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Service;

@Service
public class PriceCalculationServiceImpl implements PriceCalculationService {
    private static final BigDecimal STICKER_PRICE = new BigDecimal("2.00");
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");

    @Override
    public void update(Cart cart) {
        BigDecimal subtotal = STICKER_PRICE.multiply(BigDecimal.valueOf(cart.getItems().size())).setScale(2, RoundingMode.HALF_UP);
        BigDecimal gst = subtotal.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal shipping = BigDecimal.ZERO.setScale(2);
        cart.setSubTotal(subtotal);
        cart.setGst(gst);
        cart.setShipping(shipping);
        cart.setGrandTotal(subtotal.add(gst).add(shipping).setScale(2, RoundingMode.HALF_UP));
    }
}
