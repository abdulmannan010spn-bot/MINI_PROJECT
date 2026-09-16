package com.connectai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslateRequest {

    @NotBlank(message = "Text to translate cannot be blank")
    private String text;

    /**
     * Target language code or name, e.g. "es" (Spanish), "hi" (Hindi), "fr" (French), "de" (German), "ja" (Japanese), "ar" (Arabic)
     */
    @NotBlank(message = "Target language is required")
    private String targetLanguage;

    private String sourceLanguage;
}
