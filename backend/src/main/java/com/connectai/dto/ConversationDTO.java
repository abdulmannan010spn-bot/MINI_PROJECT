package com.connectai.dto;

import com.connectai.entity.Conversation;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO {

    private Long id;
    private String title;
    private boolean isGroup;
    private UserDTO createdBy;
    @Builder.Default
    private List<UserDTO> participants = new ArrayList<>();
    private MessageDTO lastMessage;
    private int unreadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ConversationDTO fromEntity(Conversation conversation, Long currentUserId) {
        if (conversation == null) return null;
        
        List<UserDTO> participantDtos = conversation.getParticipants() != null ?
                conversation.getParticipants().stream()
                        .map(p -> UserDTO.fromEntity(p.getUser()))
                        .collect(Collectors.toList()) : new ArrayList<>();

        MessageDTO lastMsg = null;
        if (conversation.getMessages() != null && !conversation.getMessages().isEmpty()) {
            lastMsg = MessageDTO.fromEntity(conversation.getMessages().get(conversation.getMessages().size() - 1));
        }

        int unread = 0;
        if (conversation.getParticipants() != null && currentUserId != null) {
            unread = conversation.getParticipants().stream()
                    .filter(p -> p.getUser() != null && p.getUser().getId().equals(currentUserId))
                    .mapToInt(p -> p.getUnreadCount())
                    .findFirst()
                    .orElse(0);
        }

        return ConversationDTO.builder()
                .id(conversation.getId())
                .title(conversation.getTitle())
                .isGroup(conversation.isGroup())
                .createdBy(UserDTO.fromEntity(conversation.getCreatedBy()))
                .participants(participantDtos)
                .lastMessage(lastMsg)
                .unreadCount(unread)
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }
}
