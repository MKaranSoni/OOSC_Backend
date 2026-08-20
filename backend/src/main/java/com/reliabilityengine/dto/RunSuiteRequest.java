package com.reliabilityengine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RunSuiteRequest {
    
    @NotBlank(message = "agent_name must not be blank")
    @JsonProperty("agent_name")
    private String agentName;

    @NotBlank(message = "system_prompt must not be blank")
    @JsonProperty("system_prompt")
    private String systemPrompt;

    @NotNull(message = "tools must not be null")
    private List<Map<String, Object>> tools;
}
