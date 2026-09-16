package com.connectai.service.impl;

import com.connectai.dto.CreateGroupRequest;
import com.connectai.dto.GroupDTO;
import com.connectai.entity.*;
import com.connectai.exception.BadRequestException;
import com.connectai.exception.ResourceNotFoundException;
import com.connectai.exception.UnauthorizedException;
import com.connectai.repository.*;
import com.connectai.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public GroupDTO createGroup(Long creatorId, CreateGroupRequest request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Creator user not found: " + creatorId));

        Conversation conversation = Conversation.builder()
                .title(request.getName())
                .isGroup(true)
                .createdBy(creator)
                .build();
        conversation = conversationRepository.save(conversation);

        Group group = Group.builder()
                .conversation(conversation)
                .name(request.getName())
                .description(request.getDescription())
                .groupImage(request.getGroupImage() != null ? request.getGroupImage() : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150")
                .createdBy(creator)
                .build();
        group = groupRepository.save(group);

        List<ConversationParticipant> participants = new ArrayList<>();
        participants.add(ConversationParticipant.builder()
                .conversation(conversation)
                .user(creator)
                .role(ConversationParticipant.ParticipantRole.ADMIN)
                .build());

        if (request.getMemberIds() != null) {
            for (Long memberId : request.getMemberIds()) {
                if (!memberId.equals(creatorId)) {
                    userRepository.findById(memberId).ifPresent(member -> {
                        participants.add(ConversationParticipant.builder()
                                .conversation(conversation)
                                .user(member)
                                .role(ConversationParticipant.ParticipantRole.MEMBER)
                                .build());
                    });
                }
            }
        }

        participantRepository.saveAll(participants);
        conversation.getParticipants().addAll(participants);

        // Add system message
        Message sysMessage = Message.builder()
                .conversation(conversation)
                .sender(creator)
                .content(creator.getFullName() + " created group \"" + group.getName() + "\"")
                .type(Message.MessageType.SYSTEM)
                .build();
        messageRepository.save(sysMessage);

        return GroupDTO.fromEntity(group);
    }

    @Override
    @Transactional(readOnly = true)
    public GroupDTO getGroupById(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        boolean isMember = participantRepository.existsByConversationIdAndUserId(group.getConversation().getId(), userId);
        if (!isMember) {
            throw new UnauthorizedException("You are not a member of this group");
        }

        return GroupDTO.fromEntity(group);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GroupDTO> getUserGroups(Long userId) {
        List<Group> groups = groupRepository.findByUserId(userId);
        return groups.stream()
                .map(GroupDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GroupDTO addMember(Long groupId, Long userId, Long newMemberId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        boolean isMember = participantRepository.existsByConversationIdAndUserId(group.getConversation().getId(), userId);
        if (!isMember) {
            throw new UnauthorizedException("Only existing members can add users to this group");
        }

        if (participantRepository.existsByConversationIdAndUserId(group.getConversation().getId(), newMemberId)) {
            throw new BadRequestException("User is already in this group");
        }

        User newMember = userRepository.findById(newMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + newMemberId));

        ConversationParticipant part = ConversationParticipant.builder()
                .conversation(group.getConversation())
                .user(newMember)
                .role(ConversationParticipant.ParticipantRole.MEMBER)
                .build();
        participantRepository.save(part);

        return GroupDTO.fromEntity(group);
    }

    @Override
    @Transactional
    public void removeMember(Long groupId, Long userId, Long memberIdToRemove) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        if (!group.getCreatedBy().getId().equals(userId) && !userId.equals(memberIdToRemove)) {
            throw new UnauthorizedException("Only group admins can remove other members");
        }

        participantRepository.findByConversationIdAndUserId(group.getConversation().getId(), memberIdToRemove)
                .ifPresent(participantRepository::delete);
    }
}
