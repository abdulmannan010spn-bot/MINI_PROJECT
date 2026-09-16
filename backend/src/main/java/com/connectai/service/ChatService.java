package com.connectai.service;

import com.connectai.dto.ConversationDTO;
import com.connectai.dto.MessageDTO;
import com.connectai.dto.MessageSendRequest;
import com.connectai.dto.ReactionDTO;

import java.util.List;

public interface ChatService {
    List<ConversationDTO> getUserConversations(Long userId);
    ConversationDTO getConversation(Long conversationId, Long userId);
    ConversationDTO getOrCreateDirectConversation(Long user1Id, Long user2Id);
    List<MessageDTO> getConversationMessages(Long conversationId, Long userId);
    MessageDTO sendMessage(Long userId, MessageSendRequest request);
    ReactionDTO toggleReaction(Long userId, Long messageId, String emoji);
    void markConversationAsRead(Long conversationId, Long userId);
    void deleteMessage(Long userId, Long messageId);
}
