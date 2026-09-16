package com.connectai.service;

import com.connectai.dto.*;

public interface AIService {
    SmartReplyResponse generateSmartReplies(Long userId, SmartReplyRequest request);
    RewriteResponse rewriteMessage(Long userId, RewriteRequest request);
    TranslateResponse translateMessage(Long userId, TranslateRequest request);
    SummarizeResponse summarizeConversation(Long userId, SummarizeRequest request);
    ModerateResponse moderateContent(Long userId, ModerateRequest request);
}
