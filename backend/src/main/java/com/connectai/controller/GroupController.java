package com.connectai.controller;

import com.connectai.dto.CreateGroupRequest;
import com.connectai.dto.GroupDTO;
import com.connectai.security.CustomUserDetails;
import com.connectai.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateGroupRequest request
    ) {
        GroupDTO group = groupService.createGroup(userDetails.getId(), request);
        return new ResponseEntity<>(group, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(groupService.getGroupById(id, userDetails.getId()));
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getUserGroups(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(groupService.getUserGroups(userDetails.getId()));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<GroupDTO> addMember(
            @PathVariable Long id,
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = payload.get("memberId");
        return ResponseEntity.ok(groupService.addMember(id, userDetails.getId(), memberId));
    }

    @DeleteMapping("/{id}/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long id,
            @PathVariable Long memberId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        groupService.removeMember(id, userDetails.getId(), memberId);
        return ResponseEntity.noContent().build();
    }
}
