package com.reliabilityengine.service;

import com.reliabilityengine.model.ToolCall;
import com.reliabilityengine.model.ToolResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MockToolService {

    public ToolResult executeMockTool(ToolCall toolCall) {
        // Strict safety rule: This is a deterministic mock.
        // It NEVER executes external shell scripts, HTTP calls, or Java/Python code.
        
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("status", "MOCKED");
        responseData.put("message", "Simulated " + toolCall.getName() + " operation");

        if (toolCall.getArguments() != null && !toolCall.getArguments().isEmpty()) {
            responseData.put("echoed_arguments", toolCall.getArguments());
        }

        return ToolResult.builder()
                .name(toolCall.getName())
                .response(responseData)
                .build();
    }
}
