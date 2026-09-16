package com.connectai.service;

import com.connectai.dto.CreateGroupRequest;
import com.connectai.dto.GroupDTO;

import java.util.List;

public interface GroupService {
    GroupDTO createGroup(Long creatorId, CreateGroupRequest request);
    GroupDTO getGroupById(Long groupId, Long userId);
    List<GroupDTO> getUserGroups(Long userId);
    GroupDTO addMember(Long groupId, Long userId, Long newMemberId);
    void removeMember(Long groupId, Long userId, Long memberIdToRemove);
}
