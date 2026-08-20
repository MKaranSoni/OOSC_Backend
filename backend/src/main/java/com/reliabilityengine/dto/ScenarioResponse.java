package com.reliabilityengine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScenarioResponse {

    @JsonProperty("scenario_type")
    private String scenarioType;

    @JsonProperty("user_prompt")
    private String userPrompt;

    private String description;

    @JsonProperty("expected_risk")
    private String expectedRisk;
}
