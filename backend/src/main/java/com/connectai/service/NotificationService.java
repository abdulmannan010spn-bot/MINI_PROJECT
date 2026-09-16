package com.connectai.service;

import com.connectai.dto.NotificationDTO;
import java.util.List;

public interface NotificationService {
    List<NotificationDTO> getUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
    void createNotification(Long userId, String title, String content, String type, String refId);
}
