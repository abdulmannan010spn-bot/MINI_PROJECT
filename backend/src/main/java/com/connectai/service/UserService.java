package com.connectai.service;

import com.connectai.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers(Long currentUserId);
    List<UserDTO> searchUsers(String query, Long currentUserId);
    UserDTO getUserById(Long id);
    UserDTO updateProfile(Long userId, String fullName, String bio, String profileImage);
    void updateOnlineStatus(Long userId, boolean isOnline);
}
