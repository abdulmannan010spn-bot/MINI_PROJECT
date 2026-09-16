package com.connectai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewriteRequest {

    @NotBlank(message = "Original text is required")
    private String text;

    /**
     * Tone options: PROFESSIONAL, CASUAL, POLITE, CONCISE, EXPANDED, ACADEMIC
     */
    @NotBlank(message = "Tone is required")
    private String tone;
}
