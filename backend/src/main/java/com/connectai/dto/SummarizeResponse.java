package com.connectai.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SummarizeResponse {

    private Long conversationId;
    private String summary;
    private List<String> keyActionItems;
    private int messageCount;
    private long latencyMs;
}
