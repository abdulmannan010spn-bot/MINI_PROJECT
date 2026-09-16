package com.connectai.websocket;

import com.connectai.dto.MessageDTO;
import com.connectai.dto.MessageSendRequest;
import com.connectai.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketMessageController {

    private final ChatService chatService;

    @MessageMapping("/chat.send/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}")
    public MessageDTO handleChatMessage(
            @DestinationVariable Long conversationId,
            @Payload MessageSendRequest request,
            Principal principal
    ) {
        request.setConversationId(conversationId);
        Long senderId = 1L; // Fallback demo user
        return chatService.sendMessage(senderId, request);
    }

    @MessageMapping("/chat.typing/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}/typing")
    public TypingPayload handleTyping(
            @DestinationVariable Long conversationId,
            @Payload TypingPayload payload
    ) {
        payload.setConversationId(conversationId);
        return payload;
    }
}
