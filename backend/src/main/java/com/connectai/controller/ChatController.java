package com.connectai.controller;

import com.connectai.dto.ConversationDTO;
import com.connectai.dto.MessageDTO;
import com.connectai.dto.MessageSendRequest;
import com.connectai.dto.ReactionDTO;
import com.connectai.security.CustomUserDetails;
import com.connectai.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(chatService.getUserConversations(userDetails.getId()));
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ConversationDTO> getConversation(
            @PathVariable Long conversationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(chatService.getConversation(conversationId, userDetails.getId()));
    }

    @PostMapping("/conversations/direct/{recipientId}")
    public ResponseEntity<ConversationDTO> getOrCreateDirectConversation(
            @PathVariable Long recipientId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(chatService.getOrCreateDirectConversation(userDetails.getId(), recipientId));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(
            @PathVariable Long conversationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(chatService.getConversationMessages(conversationId, userDetails.getId()));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageDTO> sendMessage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody MessageSendRequest request
    ) {
        return ResponseEntity.ok(chatService.sendMessage(userDetails.getId(), request));
    }

    @PostMapping("/messages/{messageId}/reactions")
    public ResponseEntity<ReactionDTO> toggleReaction(
            @PathVariable Long messageId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String emoji = payload.getOrDefault("emoji", "👍");
        ReactionDTO reaction = chatService.toggleReaction(userDetails.getId(), messageId, emoji);
        return ResponseEntity.ok(reaction);
    }

    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long conversationId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        chatService.markConversationAsRead(conversationId, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        chatService.deleteMessage(userDetails.getId(), messageId);
        return ResponseEntity.noContent().build();
    }
}
