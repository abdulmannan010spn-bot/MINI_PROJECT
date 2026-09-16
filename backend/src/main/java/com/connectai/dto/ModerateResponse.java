package com.connectai.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModerateResponse {

    private boolean isSafe;
    private List<String> flaggedCategories;
    private String feedback;
    private String suggestedPoliteAlternative;
    private long latencyMs;
}
