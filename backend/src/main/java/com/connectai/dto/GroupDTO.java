package com.connectai.dto;

import com.connectai.entity.Group;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupDTO {

    private Long id;
    private Long conversationId;
    private String name;
    private String description;
    private String groupImage;
    private UserDTO createdBy;
    @Builder.Default
    private List<UserDTO> members = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GroupDTO fromEntity(Group group) {
        if (group == null) return null;

        List<UserDTO> memberDtos = new ArrayList<>();
        if (group.getConversation() != null && group.getConversation().getParticipants() != null) {
            memberDtos = group.getConversation().getParticipants().stream()
                    .map(p -> UserDTO.fromEntity(p.getUser()))
                    .collect(Collectors.toList());
        }

        return GroupDTO.builder()
                .id(group.getId())
                .conversationId(group.getConversation() != null ? group.getConversation().getId() : null)
                .name(group.getName())
                .description(group.getDescription())
                .groupImage(group.getGroupImage())
                .createdBy(UserDTO.fromEntity(group.getCreatedBy()))
                .members(memberDtos)
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }
}
