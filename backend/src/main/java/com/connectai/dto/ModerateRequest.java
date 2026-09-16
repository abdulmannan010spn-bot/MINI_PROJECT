package com.connectai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModerateRequest {

    @NotBlank(message = "Message text is required")
    private String text;
}
