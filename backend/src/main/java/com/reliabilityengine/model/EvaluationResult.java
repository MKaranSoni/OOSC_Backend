package com.reliabilityengine.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResult {
    private boolean passed;
    
    @JsonProperty("failure_mode")
    private FailureMode failureMode;
    
    private String reasoning;
}
