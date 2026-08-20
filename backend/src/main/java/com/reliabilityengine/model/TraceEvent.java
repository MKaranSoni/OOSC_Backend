package com.reliabilityengine.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TraceEvent {
    private TraceEventType type;
    
    private String timestamp;
    
    private String content;
    
    @JsonProperty("tool_name")
    private String toolName;
    
    private Map<String, Object> arguments;
    
    private Map<String, Object> response;
}
