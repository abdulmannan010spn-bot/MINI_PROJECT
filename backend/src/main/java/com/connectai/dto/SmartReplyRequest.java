package com.connectai.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartReplyRequest {

    private Long conversationId;
    
    @NotEmpty(message = "Message context cannot be empty")
    private String lastMessage;

    private List<String> recentMessages;
}
