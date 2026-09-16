package com.connectai.controller;

import com.connectai.dto.*;
import com.connectai.security.CustomUserDetails;
import com.connectai.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/smart-reply")
    public ResponseEntity<SmartReplyResponse> getSmartReplies(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SmartReplyRequest request
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(aiService.generateSmartReplies(userId, request));
    }

    @PostMapping("/rewrite")
    public ResponseEntity<RewriteResponse> rewriteMessage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RewriteRequest request
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(aiService.rewriteMessage(userId, request));
    }

    @PostMapping("/translate")
    public ResponseEntity<TranslateResponse> translateMessage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody TranslateRequest request
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(aiService.translateMessage(userId, request));
    }

    @PostMapping("/summarize")
    public ResponseEntity<SummarizeResponse> summarizeConversation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody SummarizeRequest request
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(aiService.summarizeConversation(userId, request));
    }

    @PostMapping("/moderate")
    public ResponseEntity<ModerateResponse> moderateContent(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ModerateRequest request
    ) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        return ResponseEntity.ok(aiService.moderateContent(userId, request));
    }
}
