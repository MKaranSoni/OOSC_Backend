package com.reliabilityengine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestResultResponse {

    private UUID id;

    @JsonProperty("scenario_type")
    private String scenarioType;

    @JsonProperty("user_prompt")
    private String userPrompt;

    private Boolean passed;

    @JsonProperty("failure_mode")
    private String failureMode;

    private String reasoning;
    private Object trace;
}
