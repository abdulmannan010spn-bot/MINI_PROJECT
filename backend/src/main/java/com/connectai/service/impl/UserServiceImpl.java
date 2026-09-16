package com.connectai.service.impl;

import com.connectai.dto.UserDTO;
import com.connectai.entity.User;
import com.connectai.exception.ResourceNotFoundException;
import com.connectai.repository.UserRepository;
import com.connectai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers(Long currentUserId) {
        return userRepository.findAll().stream()
                .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> searchUsers(String query, Long currentUserId) {
        if (query == null || query.trim().isEmpty()) {
            return getAllUsers(currentUserId);
        }
        return userRepository.searchUsers(query.trim()).stream()
                .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public UserDTO updateProfile(Long userId, String fullName, String bio, String profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName.trim());
        }
        if (bio != null) {
            user.setBio(bio.trim());
        }
        if (profileImage != null && !profileImage.trim().isEmpty()) {
            user.setProfileImage(profileImage.trim());
        }

        user = userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public void updateOnlineStatus(Long userId, boolean isOnline) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setOnline(isOnline);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}
