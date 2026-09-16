package com.connectai.service;

import com.connectai.dto.AuthRequest;
import com.connectai.dto.AuthResponse;
import com.connectai.dto.GoogleAuthRequest;
import com.connectai.dto.RegisterRequest;
import com.connectai.dto.UserDTO;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    AuthResponse googleAuth(GoogleAuthRequest request);
    UserDTO getCurrentUser(Long userId);
    void updatePresence(Long userId, boolean online);
}
