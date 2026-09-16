package com.connectai.dto;

import com.connectai.entity.User;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String profileImage;
    private String bio;
    private String provider;
    private boolean online;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;

    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .provider(user.getProvider() != null ? user.getProvider().name() : "LOCAL")
                .online(user.isOnline())
                .lastSeen(user.getLastSeen())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
