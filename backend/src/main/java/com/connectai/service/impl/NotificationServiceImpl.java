package com.connectai.service.impl;

import com.connectai.dto.NotificationDTO;
import com.connectai.entity.Notification;
import com.connectai.entity.User;
import com.connectai.exception.ResourceNotFoundException;
import com.connectai.exception.UnauthorizedException;
import com.connectai.repository.NotificationRepository;
import com.connectai.repository.UserRepository;
import com.connectai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notif.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized access to notification");
        }

        notif.setRead(true);
        notificationRepository.save(notif);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);
    }

    @Override
    @Transactional
    public void createNotification(Long userId, String title, String content, String type, String refId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        Notification.NotificationType nType = Notification.NotificationType.SYSTEM;
        try {
            nType = Notification.NotificationType.valueOf(type.toUpperCase());
        } catch (Exception ignored) {}

        Notification notif = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(nType)
                .referenceId(refId)
                .isRead(false)
                .build();

        notif = notificationRepository.save(notif);
        NotificationDTO dto = NotificationDTO.fromEntity(notif);

        try {
            messagingTemplate.convertAndSend("/topic/user/" + userId + "/notifications", dto);
        } catch (Exception e) {
            log.warn("Notification WebSocket broadcast failed: {}", e.getMessage());
        }
    }
}
