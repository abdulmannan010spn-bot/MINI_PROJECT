package com.connectai.dto;

import com.connectai.entity.MessageReaction;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactionDTO {

    private Long id;
    private Long messageId;
    private Long userId;
    private String userName;
    private String emoji;
    private LocalDateTime createdAt;

    public static ReactionDTO fromEntity(MessageReaction reaction) {
        if (reaction == null) return null;
        return ReactionDTO.builder()
                .id(reaction.getId())
                .messageId(reaction.getMessage().getId())
                .userId(reaction.getUser().getId())
                .userName(reaction.getUser().getFullName())
                .emoji(reaction.getEmoji())
                .createdAt(reaction.getCreatedAt())
                .build();
    }
}
