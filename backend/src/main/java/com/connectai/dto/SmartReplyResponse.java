package com.connectai.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartReplyResponse {

    private List<String> suggestions;
    private String reasoning;
    private long latencyMs;
}
