package com.connectai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageSendRequest {

    private Long conversationId;
    private Long recipientId; // Used if creating new 1-on-1 direct conversation on first message
    private String content;
    private String imageUrl;
    private String audioUrl;
    private Integer audioDurationSeconds;
    private boolean isAiGenerated;
    @Builder.Default
    private String type = "TEXT";
}
