package com.connectai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    private String name;

    private String description;
    private String groupImage;

    @NotEmpty(message = "At least one member must be selected")
    private List<Long> memberIds;
}
