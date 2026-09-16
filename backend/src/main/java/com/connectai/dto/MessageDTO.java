package com.connectai.dto;

import com.connectai.entity.Message;
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
public class MessageDTO {

    private Long id;
    private Long conversationId;
    private UserDTO sender;
    private String content;
    private String imageUrl;
    private String audioUrl;
    private Integer audioDurationSeconds;
    private boolean isAiGenerated;
    private String type;
    private boolean isRead;
    @Builder.Default
    private List<ReactionDTO> reactions = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MessageDTO fromEntity(Message message) {
        if (message == null) return null;
        return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversation() != null ? message.getConversation().getId() : null)
                .sender(UserDTO.fromEntity(message.getSender()))
                .content(message.getContent())
                .imageUrl(message.getImageUrl())
                .audioUrl(message.getAudioUrl())
                .audioDurationSeconds(message.getAudioDurationSeconds())
                .isAiGenerated(message.isAiGenerated())
                .type(message.getType() != null ? message.getType().name() : "TEXT")
                .isRead(message.isRead())
                .reactions(message.getReactions() != null ?
                        message.getReactions().stream().map(ReactionDTO::fromEntity).collect(Collectors.toList()) : new ArrayList<>())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
}
