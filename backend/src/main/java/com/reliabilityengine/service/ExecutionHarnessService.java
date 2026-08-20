package com.reliabilityengine.service;

import com.reliabilityengine.config.ExecutionConfig;
import com.reliabilityengine.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExecutionHarnessService {

    private final AgentSimulationService agentSimulationService;
    private final MockToolService mockToolService;
    private final ExecutionConfig executionConfig;

    public ExecutionResult executeScenario(Scenario scenario, String agentSystemPrompt, String agentToolsJson) {
        log.info("Starting execution for Scenario ID: {}", scenario.getId());
        
        List<TraceEvent> events = new ArrayList<>();
        events.add(TraceEvent.builder()
                .type(TraceEventType.USER_MESSAGE)
                .content(scenario.getUserPrompt())
                .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                .build());

        ExecutionTrace trace = ExecutionTrace.builder().events(events).build();
        
        int turnCount = 0;
        boolean completed = false;
        boolean terminatedByLimit = false;
        String finalResponse = null;

        try {
            while (turnCount < executionConfig.getMaxTurns()) {
                turnCount++;
                log.info("Scenario ID: {} | Turn: {}", scenario.getId(), turnCount);

                AgentMessage agentMessage = agentSimulationService.getNextAgentAction(agentSystemPrompt, agentToolsJson, trace);

                if (agentMessage.getToolCall() != null) {
                    ToolCall toolCall = agentMessage.getToolCall();
                    events.add(TraceEvent.builder()
                            .type(TraceEventType.TOOL_CALL)
                            .toolName(toolCall.getName())
                            .arguments(toolCall.getArguments())
                            .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                            .build());

                    ToolResult toolResult = mockToolService.executeMockTool(toolCall);
                    
                    events.add(TraceEvent.builder()
                            .type(TraceEventType.TOOL_RESPONSE)
                            .toolName(toolResult.getName())
                            .response(toolResult.getResponse())
                            .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                            .build());
                } else {
                    finalResponse = agentMessage.getContent();
                    events.add(TraceEvent.builder()
                            .type(TraceEventType.ASSISTANT_MESSAGE)
                            .content(finalResponse)
                            .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                            .build());
                    events.add(TraceEvent.builder()
                            .type(TraceEventType.FINAL_RESPONSE)
                            .content(finalResponse)
                            .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                            .build());
                    completed = true;
                    break; // End execution successfully
                }
            }

            if (!completed) {
                log.warn("Scenario ID: {} terminated by execution limit ({} turns)", scenario.getId(), executionConfig.getMaxTurns());
                terminatedByLimit = true;
                events.add(TraceEvent.builder()
                        .type(TraceEventType.EXECUTION_LIMIT)
                        .content("Execution reached maximum allowed turns: " + executionConfig.getMaxTurns())
                        .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                        .build());
            }

        } catch (Exception e) {
            log.error("Execution failed for Scenario ID: " + scenario.getId(), e);
            events.add(TraceEvent.builder()
                    .type(TraceEventType.ERROR)
                    .content("Execution failed: " + e.getMessage())
                    .timestamp(java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString())
                    .build());
        }

        log.info("Execution finished for Scenario ID: {}", scenario.getId());

        return ExecutionResult.builder()
                .scenarioId(scenario.getId())
                .completed(completed)
                .terminatedByLimit(terminatedByLimit)
                .finalResponse(finalResponse)
                .trace(trace)
                .turnCount(turnCount)
                .build();
    }
}
