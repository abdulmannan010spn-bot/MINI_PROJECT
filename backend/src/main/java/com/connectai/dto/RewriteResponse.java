package com.connectai.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewriteResponse {

    private String originalText;
    private String tone;
    private String rewrittenText;
    private long latencyMs;
}
