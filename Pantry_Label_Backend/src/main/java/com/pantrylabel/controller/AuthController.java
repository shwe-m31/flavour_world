package com.pantrylabel.controller;

import com.pantrylabel.dto.request.LoginRequest;
import com.pantrylabel.dto.request.OtpRequest;
import com.pantrylabel.dto.request.OtpVerifyRequest;
import com.pantrylabel.dto.request.RegisterRequest;
import com.pantrylabel.dto.response.AuthResponse;
import com.pantrylabel.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Void> sendOtp(@Valid @RequestBody OtpRequest request) {
        service.sendOtp(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return service.verifyOtp(request);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }
}
