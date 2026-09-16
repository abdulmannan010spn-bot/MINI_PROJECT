package com.connectai.controller;

import com.connectai.dto.UserDTO;
import com.connectai.security.CustomUserDetails;
import com.connectai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(userService.getAllUsers(currentUserId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(required = false, defaultValue = "") String q,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long currentUserId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(userService.searchUsers(q, currentUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> payload
    ) {
        String fullName = payload.get("fullName");
        String bio = payload.get("bio");
        String profileImage = payload.get("profileImage");
        return ResponseEntity.ok(userService.updateProfile(userDetails.getId(), fullName, bio, profileImage));
    }

    @PostMapping("/status")
    public ResponseEntity<Void> updateStatus(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Boolean> payload
    ) {
        Boolean online = payload.getOrDefault("online", true);
        userService.updateOnlineStatus(userDetails.getId(), online);
        return ResponseEntity.ok().build();
    }
}
