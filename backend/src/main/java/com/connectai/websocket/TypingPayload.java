package com.connectai.websocket;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypingPayload {

    private Long conversationId;
    private Long userId;
    private String username;
    private String fullName;
    private boolean typing;
}
