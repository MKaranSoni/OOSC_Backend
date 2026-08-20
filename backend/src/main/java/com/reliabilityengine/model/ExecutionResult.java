package com.reliabilityengine.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExecutionResult {
    private UUID scenarioId;
    private boolean completed;
    private boolean terminatedByLimit;
    private String finalResponse;
    private ExecutionTrace trace;
    private int turnCount;
}
