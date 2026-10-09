package com.pantrylabel.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;

@Component
public class HmacUtil {

    public boolean matches(String orderId, String paymentId, String signature, String secret) {
        if (orderId == null || paymentId == null || signature == null || secret == null) {
            return false;
        }
        if (signature.length() % 2 != 0) {
            return false;
        }
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] expected = mac.doFinal((orderId + "|" + paymentId).getBytes(StandardCharsets.UTF_8));
            byte[] actual = hexToBytes(signature);
            if (actual == null) {
                return false;
            }
            return MessageDigest.isEqual(expected, actual);
        } catch (Exception ex) {
            return false;
        }
    }

    private byte[] hexToBytes(String value) {
        int length = value.length();
        byte[] bytes = new byte[length / 2];
        for (int i = 0; i < length; i += 2) {
            int d1 = Character.digit(value.charAt(i), 16);
            int d2 = Character.digit(value.charAt(i + 1), 16);
            if (d1 == -1 || d2 == -1) {
                return null;
            }
            bytes[i / 2] = (byte) ((d1 << 4) + d2);
        }
        return bytes;
    }
}
