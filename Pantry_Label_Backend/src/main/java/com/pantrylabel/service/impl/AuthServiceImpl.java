package com.pantrylabel.service.impl;

import com.pantrylabel.dto.request.LoginRequest;
import com.pantrylabel.dto.request.OtpRequest;
import com.pantrylabel.dto.request.OtpVerifyRequest;
import com.pantrylabel.dto.request.RegisterRequest;
import com.pantrylabel.dto.response.AuthResponse;
import com.pantrylabel.entity.User;
import com.pantrylabel.exception.OtpExpiredException;
import com.pantrylabel.mapper.DtoMapper;
import com.pantrylabel.repository.UserRepository;
import com.pantrylabel.security.JwtUtil;
import com.pantrylabel.service.AuthService;
import com.pantrylabel.service.NotificationService;
import com.pantrylabel.util.OtpGenerator;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private record OtpEntry(String otp, LocalDateTime expiry) {}

    private final UserRepository users;
    private final OtpGenerator otpGenerator;
    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;
    private final DtoMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, OtpEntry> pendingRegistrationOtps = new ConcurrentHashMap<>();

    public AuthServiceImpl(UserRepository users,
                           OtpGenerator otpGenerator,
                           NotificationService notificationService,
                           JwtUtil jwtUtil,
                           DtoMapper mapper,
                           PasswordEncoder passwordEncoder) {
        this.users = users;
        this.otpGenerator = otpGenerator;
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void sendOtp(OtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String purpose = request.getPurpose();

        if ("LOGIN".equalsIgnoreCase(purpose)) {
            User user = users.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user. Account does not exist. Please create an account first."));
            String otp = otpGenerator.generate();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            users.save(user);
            notificationService.sendOtp(email, otp);
            return;
        }

        if ("REGISTER".equalsIgnoreCase(purpose)) {
            if (users.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException("An account with this email already exists. Please sign in instead.");
            }
            String otp = otpGenerator.generate();
            pendingRegistrationOtps.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));
            notificationService.sendOtp(email, otp);
            return;
        }

        // Fallback when purpose is not explicitly specified
        if (users.findByEmail(email).isPresent()) {
            User user = users.findByEmail(email).get();
            String otp = otpGenerator.generate();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            users.save(user);
            notificationService.sendOtp(email, otp);
        } else {
            String otp = otpGenerator.generate();
            pendingRegistrationOtps.put(email, new OtpEntry(otp, LocalDateTime.now().plusMinutes(10)));
            notificationService.sendOtp(email, otp);
        }
    }

    @Override
    @Transactional
    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String rawOtp = request.getOtp().trim();
        String purpose = request.getPurpose();

        if ("REGISTER".equalsIgnoreCase(purpose)) {
            OtpEntry entry = pendingRegistrationOtps.get(email);
            if (entry == null || entry.expiry().isBefore(LocalDateTime.now()) || !entry.otp().equals(rawOtp)) {
                throw new OtpExpiredException("Invalid or expired OTP. Please verify and retry.");
            }
            pendingRegistrationOtps.remove(email);

            if (users.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException("An account with this email already exists. Please sign in instead.");
            }

            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "_");
            String username = baseUsername;
            int counter = 1;
            while (users.findByUsername(username).isPresent()) {
                username = baseUsername + "_" + counter++;
            }

            User user = User.builder()
                    .email(email)
                    .username(username)
                    .name(baseUsername)
                    .profileCompleted(false)
                    .build();
            user = users.save(user);

            return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
        }

        if ("LOGIN".equalsIgnoreCase(purpose)) {
            User user = users.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user. Account does not exist. Please create an account first."));
            if (user.getOtp() == null || user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now()) || !user.getOtp().equals(rawOtp)) {
                throw new OtpExpiredException("Invalid or expired OTP. Please verify and retry.");
            }
            user.setOtp(null);
            user.setOtpExpiry(null);
            users.save(user);

            return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
        }

        // Fallback when purpose is not explicitly specified
        if (users.findByEmail(email).isPresent()) {
            User user = users.findByEmail(email).get();
            if (user.getOtp() == null || user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now()) || !user.getOtp().equals(rawOtp)) {
                throw new OtpExpiredException("Invalid or expired OTP. Please verify and retry.");
            }
            user.setOtp(null);
            user.setOtpExpiry(null);
            users.save(user);
            return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
        } else {
            OtpEntry entry = pendingRegistrationOtps.get(email);
            if (entry == null || entry.expiry().isBefore(LocalDateTime.now()) || !entry.otp().equals(rawOtp)) {
                throw new OtpExpiredException("Invalid or expired OTP. Please verify and retry.");
            }
            pendingRegistrationOtps.remove(email);

            String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "_");
            String username = baseUsername;
            int counter = 1;
            while (users.findByUsername(username).isPresent()) {
                username = baseUsername + "_" + counter++;
            }

            User user = User.builder()
                    .email(email)
                    .username(username)
                    .name(baseUsername)
                    .profileCompleted(false)
                    .build();
            user = users.save(user);
            return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
        }
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        if (username.length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters long.");
        }
        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Username must contain only letters, numbers, or underscores.");
        }
        if (users.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists. Please choose another username.");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        String email = (request.getEmail() != null && !request.getEmail().trim().isEmpty())
                ? request.getEmail().trim().toLowerCase()
                : (username.toLowerCase() + "@flavourworld.com");

        if (users.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .username(username)
                .password(encodedPassword)
                .email(email)
                .name(username)
                .profileCompleted(false)
                .build();
        user = users.save(user);

        return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();

        User user = users.findByUsername(identifier)
                .or(() -> users.findByEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user. Account does not exist. Please create an account first."));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password.");
        }

        return new AuthResponse(jwtUtil.generateToken(user.getEmail(), user.getId()), mapper.user(user));
    }
}
