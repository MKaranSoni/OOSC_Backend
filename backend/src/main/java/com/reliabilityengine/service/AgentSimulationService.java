package com.reliabilityengine.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.reliabilityengine.model.AgentMessage;
import com.reliabilityengine.model.ExecutionTrace;
import com.reliabilityengine.model.ToolCall;
import com.reliabilityengine.model.TraceEvent;
import com.reliabilityengine.model.TraceEventType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AgentSimulationService {

    private final LlmService llmService;
    private final ObjectMapper objectMapper;

    public AgentMessage getNextAgentAction(String targetSystemPrompt, String toolsJson, ExecutionTrace trace) {
        String systemInstruction = buildSystemContext(targetSystemPrompt, toolsJson);
        String userContext = buildConversationContext(trace);
        
        String llmResponseStr = llmService.generateStructuredResponse(systemInstruction, userContext);
        return parseAgentMessage(llmResponseStr);
    }

    private String buildSystemContext(String targetSystemPrompt, String toolsJson) {
        return "You are simulating the target AI agent. Behave exactly as the target system prompt instructs.\n\n" +
               "Target System Prompt:\n" + targetSystemPrompt + "\n\n" +
               "Available Tools:\n" + toolsJson + "\n\n" +
               "INSTRUCTIONS FOR YOU (THE SIMULATOR):\n" +
               "You must return your output strictly in JSON. If you want to use a tool, return:\n" +
               "{\"tool_call\": {\"name\": \"tool_name\", \"arguments\": {\"key\": \"value\"}}}\n" +
               "If you want to send a final response to the user, return:\n" +
               "{\"content\": \"your response\"}";
    }

    private String buildConversationContext(ExecutionTrace trace) {
        try {
            ArrayNode messages = objectMapper.createArrayNode();
            
            for (TraceEvent event : trace.getEvents()) {
                ObjectNode msg = objectMapper.createObjectNode();
                switch (event.getType()) {
                    case USER_MESSAGE:
                        msg.put("role", "user");
                        msg.put("content", event.getContent());
                        messages.add(msg);
                        break;
                    case ASSISTANT_MESSAGE:
                        msg.put("role", "assistant");
                        msg.put("content", event.getContent());
                        messages.add(msg);
                        break;
                    case TOOL_CALL:
                        msg.put("role", "assistant");
                        msg.put("content", "Requested Tool: " + event.getToolName() + " with args " + objectMapper.writeValueAsString(event.getArguments()));
                        messages.add(msg);
                        break;
                    case TOOL_RESPONSE:
                        msg.put("role", "user");
                        msg.put("content", "Tool Response for " + event.getToolName() + ": " + objectMapper.writeValueAsString(event.getResponse()));
                        messages.add(msg);
                        break;
                    default:
                        break;
                }
            }
            return objectMapper.writeValueAsString(messages);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize conversation history", e);
        }
    }

    private AgentMessage parseAgentMessage(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            
            if (root.has("tool_call") && !root.get("tool_call").isNull()) {
                JsonNode toolCallNode = root.get("tool_call");
                String name = toolCallNode.path("name").asText();
                Map<String, Object> arguments = objectMapper.convertValue(toolCallNode.path("arguments"), Map.class);
                return AgentMessage.builder()
                        .toolCall(ToolCall.builder().name(name).arguments(arguments).build())
                        .build();
            }
            
            return AgentMessage.builder()
                    .content(root.path("content").asText(""))
                    .build();
            
        } catch (Exception e) {
            // Fallback gracefully on parsing failure
            return AgentMessage.builder()
                    .content("Error parsing response: " + e.getMessage())
                    .build();
        }
    }
}
