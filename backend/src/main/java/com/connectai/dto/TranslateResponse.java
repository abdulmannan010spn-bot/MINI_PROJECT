package com.connectai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslateResponse {

    private String originalText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
    private long latencyMs;
}
