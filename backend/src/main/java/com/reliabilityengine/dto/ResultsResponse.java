package com.reliabilityengine.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultsResponse {

    @JsonProperty("suite_id")
    private UUID suiteId;

    @JsonProperty("agent_name")
    private String agentName;

    private int score;
    private String status;
    private long passed;
    private long failed;
    private long total;

    private List<TestResultResponse> results;
}
