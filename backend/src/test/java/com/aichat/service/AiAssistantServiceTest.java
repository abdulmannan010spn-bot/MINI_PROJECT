package com.aichat.service;

import com.aichat.model.Message;
import com.aichat.model.dto.AiPromptRequest;
import com.aichat.model.dto.AiPromptResponse;
import com.aichat.model.dto.ConversationSummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AiAssistantServiceTest {

    private AiAssistantService aiAssistantService;

    @BeforeEach
    void setUp() {
        aiAssistantService = new AiAssistantService();
    }

    @Test
    void testSmartRepliesGeneration() {
        AiPromptRequest request = AiPromptRequest.builder()
                .context("Have you checked the Spring Boot WebSocket endpoint?")
                .build();

        List<String> replies = aiAssistantService.generateSmartReplies(request);
        assertNotNull(replies);
        assertFalse(replies.isEmpty());
        assertTrue(replies.stream().anyMatch(r -> r.toLowerCase().contains("spring") || r.toLowerCase().contains("websocket")));
    }

    @Test
    void testRewriteMessageFormal() {
        AiPromptRequest request = AiPromptRequest.builder()
                .text("we finished the project code.")
                .tone("formal")
                .build();

        AiPromptResponse response = aiAssistantService.rewriteMessage(request);
        assertNotNull(response.getRewrittenText());
        assertTrue(response.getRewrittenText().contains("inform you"));
    }

    @Test
    void testTranslateMessageHindi() {
        AiPromptRequest request = AiPromptRequest.builder()
                .text("Hello")
                .targetLanguage("Hindi")
                .build();

        AiPromptResponse response = aiAssistantService.translateMessage(request);
        assertNotNull(response.getTranslatedText());
        assertTrue(response.getTranslatedText().contains("नमस्ते") || response.getTranslatedText().contains("Hindi"));
    }

    @Test
    void testSummarizeConversation() {
        List<Message> messages = Arrays.asList(
                Message.builder().senderName("Aditya").text("Let us test the React frontend and Spring Boot backend.").build(),
                Message.builder().senderName("Abdul").text("All modules are integrated.").build()
        );

        AiPromptRequest request = AiPromptRequest.builder()
                .conversationTitle("AKGEC Project Team")
                .messages(messages)
                .build();

        ConversationSummaryDto summary = aiAssistantService.summarizeConversation(request);
        assertNotNull(summary.getSummary());
        assertFalse(summary.getKeyPoints().isEmpty());
        assertFalse(summary.getActionItems().isEmpty());
    }

    @Test
    void testContentModeration() {
        AiPromptResponse cleanCheck = aiAssistantService.checkModeration("Hello team, great job on the demo!");
        assertFalse(cleanCheck.getIsFlagged());

        AiPromptResponse flaggedCheck = aiAssistantService.checkModeration("This message contains hate speech");
        assertTrue(flaggedCheck.getIsFlagged());
    }
}
