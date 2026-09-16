package com.connectai.service.impl;

import com.connectai.dto.*;
import com.connectai.entity.User;
import com.connectai.exception.BadRequestException;
import com.connectai.exception.ResourceNotFoundException;
import com.connectai.exception.UnauthorizedException;
import com.connectai.repository.UserRepository;
import com.connectai.security.CustomUserDetails;
import com.connectai.security.JwtService;
import com.connectai.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = request.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");
        }

        if (userRepository.existsByUsername(username)) {
            username = username + "_" + System.currentTimeMillis() % 1000;
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(username)
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .profileImage(request.getProfileImage() != null ? request.getProfileImage() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .bio(request.getBio() != null ? request.getBio() : "ConnectAI user")
                .provider(User.AuthProvider.LOCAL)
                .online(true)
                .lastSeen(LocalDateTime.now())
                .build();

        user = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setOnline(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse googleAuth(GoogleAuthRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Google email cannot be empty");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    String baseUsername = request.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-zA-Z0-9_]", "");
                    if (userRepository.existsByUsername(baseUsername)) {
                        baseUsername = baseUsername + "_" + System.currentTimeMillis() % 1000;
                    }

                    User newUser = User.builder()
                            .fullName(request.getFullName() != null && !request.getFullName().isEmpty() ? request.getFullName() : request.getEmail().split("@")[0])
                            .username(baseUsername)
                            .email(request.getEmail())
                            .googleId(request.getGoogleId())
                            .profileImage(request.getProfileImage() != null ? request.getProfileImage() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                            .bio("ConnectAI Google Verified User")
                            .provider(User.AuthProvider.GOOGLE)
                            .online(true)
                            .lastSeen(LocalDateTime.now())
                            .build();
                    return userRepository.save(newUser);
                });

        user.setOnline(true);
        user.setLastSeen(LocalDateTime.now());
        if (request.getProfileImage() != null && (user.getProfileImage() == null || user.getProfileImage().isEmpty())) {
            user.setProfileImage(request.getProfileImage());
        }
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public void updatePresence(Long userId, boolean online) {
        userRepository.findById(userId).ifPresent(u -> {
            u.setOnline(online);
            u.setLastSeen(LocalDateTime.now());
            userRepository.save(u);
        });
    }
}
