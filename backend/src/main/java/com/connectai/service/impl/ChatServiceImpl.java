package com.connectai.service.impl;

import com.connectai.dto.ConversationDTO;
import com.connectai.dto.MessageDTO;
import com.connectai.dto.MessageSendRequest;
import com.connectai.dto.ReactionDTO;
import com.connectai.entity.*;
import com.connectai.exception.BadRequestException;
import com.connectai.exception.ResourceNotFoundException;
import com.connectai.exception.UnauthorizedException;
import com.connectai.repository.*;
import com.connectai.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final MessageReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDTO> getUserConversations(Long userId) {
        List<Conversation> convs = conversationRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        return convs.stream()
                .map(c -> ConversationDTO.fromEntity(c, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationDTO getConversation(Long conversationId, Long userId) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        boolean isParticipant = participantRepository.existsByConversationIdAndUserId(conversationId, userId);
        if (!isParticipant) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        return ConversationDTO.fromEntity(conv, userId);
    }

    @Override
    @Transactional
    public ConversationDTO getOrCreateDirectConversation(Long user1Id, Long user2Id) {
        if (user1Id.equals(user2Id)) {
            throw new BadRequestException("Cannot create a direct conversation with yourself");
        }

        Optional<Conversation> existing = conversationRepository.findDirectConversationBetweenUsers(user1Id, user2Id);
        if (existing.isPresent()) {
            return ConversationDTO.fromEntity(existing.get(), user1Id);
        }

        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + user1Id));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + user2Id));

        Conversation conversation = Conversation.builder()
                .isGroup(false)
                .createdBy(user1)
                .build();
        conversation = conversationRepository.save(conversation);

        ConversationParticipant part1 = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user1)
                .role(ConversationParticipant.ParticipantRole.MEMBER)
                .build();

        ConversationParticipant part2 = ConversationParticipant.builder()
                .conversation(conversation)
                .user(user2)
                .role(ConversationParticipant.ParticipantRole.MEMBER)
                .build();

        participantRepository.saveAll(Arrays.asList(part1, part2));
        conversation.getParticipants().addAll(Arrays.asList(part1, part2));

        return ConversationDTO.fromEntity(conversation, user1Id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDTO> getConversationMessages(Long conversationId, Long userId) {
        boolean isParticipant = participantRepository.existsByConversationIdAndUserId(conversationId, userId);
        if (!isParticipant) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageDTO sendMessage(Long userId, MessageSendRequest request) {
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Conversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + request.getConversationId()));
        } else if (request.getRecipientId() != null) {
            ConversationDTO convDto = getOrCreateDirectConversation(userId, request.getRecipientId());
            conversation = conversationRepository.findById(convDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        } else {
            throw new BadRequestException("Either conversationId or recipientId must be provided");
        }

        Message.MessageType messageType = Message.MessageType.TEXT;
        if (request.getType() != null) {
            try {
                messageType = Message.MessageType.valueOf(request.getType().toUpperCase());
            } catch (Exception ignored) {}
        }

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .audioUrl(request.getAudioUrl())
                .audioDurationSeconds(request.getAudioDurationSeconds())
                .isAiGenerated(request.isAiGenerated())
                .type(messageType)
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        // Update conversation timestamp
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        // Increment unread count for other participants
        for (ConversationParticipant p : conversation.getParticipants()) {
            if (!p.getUser().getId().equals(userId)) {
                p.setUnreadCount(p.getUnreadCount() + 1);
                participantRepository.save(p);
            }
        }

        MessageDTO dto = MessageDTO.fromEntity(message);

        // Broadcast via WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/conversation/" + conversation.getId(), dto);
        } catch (Exception e) {
            log.warn("WebSocket broadcast failed: {}", e.getMessage());
        }

        return dto;
    }

    @Override
    @Transactional
    public ReactionDTO toggleReaction(Long userId, Long messageId, String emoji) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));

        Optional<MessageReaction> existing = reactionRepository.findByMessageIdAndUserIdAndEmoji(messageId, userId, emoji);

        if (existing.isPresent()) {
            reactionRepository.delete(existing.get());
            return null; // Reaction removed
        } else {
            MessageReaction reaction = MessageReaction.builder()
                    .message(message)
                    .user(user)
                    .emoji(emoji)
                    .build();
            reaction = reactionRepository.save(reaction);

            ReactionDTO reactionDTO = ReactionDTO.fromEntity(reaction);

            // Broadcast reaction update
            try {
                messagingTemplate.convertAndSend("/topic/conversation/" + message.getConversation().getId() + "/reactions", reactionDTO);
            } catch (Exception e) {
                log.warn("Reaction WebSocket broadcast failed: {}", e.getMessage());
            }

            return reactionDTO;
        }
    }

    @Override
    @Transactional
    public void markConversationAsRead(Long conversationId, Long userId) {
        participantRepository.findByConversationIdAndUserId(conversationId, userId).ifPresent(p -> {
            p.setUnreadCount(0);
            participantRepository.save(p);
        });
    }

    @Override
    @Transactional
    public void deleteMessage(Long userId, Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));

        if (!message.getSender().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own messages");
        }

        messageRepository.delete(message);
    }
}
