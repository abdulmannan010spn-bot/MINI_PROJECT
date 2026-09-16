package com.connectai.dto;

import com.connectai.entity.Notification;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String type;
    private String referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationDTO fromEntity(Notification notification) {
        if (notification == null) return null;
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType() != null ? notification.getType().name() : "SYSTEM")
                .referenceId(notification.getReferenceId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
