package com.connectai.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummarizeRequest {

    @NotNull(message = "Conversation ID is required")
    private Long conversationId;

    private Integer maxMessages;
}
