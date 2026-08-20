package com.reliabilityengine.service;

import com.reliabilityengine.config.ExecutionConfig;
import com.reliabilityengine.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExecutionHarnessServiceTest {

    @Mock
    private AgentSimulationService agentSimulationService;

    @Mock
    private MockToolService mockToolService;

    @Mock
    private ExecutionConfig executionConfig;

    private ExecutionHarnessService executionHarnessService;

    @BeforeEach
    public void setup() {
        when(executionConfig.getMaxTurns()).thenReturn(3);
        executionHarnessService = new ExecutionHarnessService(agentSimulationService, mockToolService, executionConfig);
    }

    @Test
    public void testNormalScenarioNoToolCall() {
        Scenario scenario = Scenario.builder()
                .id(UUID.randomUUID())
                .userPrompt("Hello")
                .build();

        AgentMessage mockMessage = AgentMessage.builder()
                .content("Hi there")
                .build();

        when(agentSimulationService.getNextAgentAction(anyString(), anyString(), any(ExecutionTrace.class)))
                .thenReturn(mockMessage);

        ExecutionResult result = executionHarnessService.executeScenario(scenario, "system prompt", "[]");

        assertTrue(result.isCompleted());
        assertFalse(result.isTerminatedByLimit());
        assertEquals("Hi there", result.getFinalResponse());
        assertEquals(1, result.getTurnCount());

        verify(mockToolService, never()).executeMockTool(any(ToolCall.class));
    }

    @Test
    public void testScenarioRequiringOneTool() {
        Scenario scenario = Scenario.builder()
                .id(UUID.randomUUID())
                .userPrompt("Lookup user 123")
                .build();

        ToolCall toolCall = ToolCall.builder()
                .name("lookup_record")
                .arguments(Map.of("id", "123"))
                .build();

        AgentMessage toolCallMessage = AgentMessage.builder()
                .toolCall(toolCall)
                .build();

        AgentMessage finalMessage = AgentMessage.builder()
                .content("User 123 is Alice")
                .build();

        when(agentSimulationService.getNextAgentAction(anyString(), anyString(), any(ExecutionTrace.class)))
                .thenReturn(toolCallMessage)
                .thenReturn(finalMessage);

        ToolResult toolResult = ToolResult.builder()
                .name("lookup_record")
                .response(Map.of("status", "MOCKED", "data", "Alice"))
                .build();

        when(mockToolService.executeMockTool(any(ToolCall.class))).thenReturn(toolResult);

        ExecutionResult result = executionHarnessService.executeScenario(scenario, "system prompt", "[]");

        assertTrue(result.isCompleted());
        assertFalse(result.isTerminatedByLimit());
        assertEquals("User 123 is Alice", result.getFinalResponse());
        assertEquals(2, result.getTurnCount());

        verify(mockToolService, times(1)).executeMockTool(any(ToolCall.class));
        
        long toolCallCount = result.getTrace().getEvents().stream()
                .filter(e -> e.getType() == TraceEventType.TOOL_CALL)
                .count();
        assertEquals(1, toolCallCount);
    }

    @Test
    public void testRepeatedToolCallsMaxTurns() {
        Scenario scenario = Scenario.builder()
                .id(UUID.randomUUID())
                .userPrompt("Looping agent")
                .build();

        ToolCall toolCall = ToolCall.builder()
                .name("loop_tool")
                .arguments(new HashMap<>())
                .build();

        AgentMessage toolCallMessage = AgentMessage.builder()
                .toolCall(toolCall)
                .build();

        when(agentSimulationService.getNextAgentAction(anyString(), anyString(), any(ExecutionTrace.class)))
                .thenReturn(toolCallMessage);

        ToolResult toolResult = ToolResult.builder()
                .name("loop_tool")
                .response(Map.of("status", "MOCKED"))
                .build();

        when(mockToolService.executeMockTool(any(ToolCall.class))).thenReturn(toolResult);

        ExecutionResult result = executionHarnessService.executeScenario(scenario, "system prompt", "[]");

        assertFalse(result.isCompleted());
        assertTrue(result.isTerminatedByLimit());
        assertNull(result.getFinalResponse());
        assertEquals(3, result.getTurnCount());

        verify(mockToolService, times(3)).executeMockTool(any(ToolCall.class));
        
        long limitEventCount = result.getTrace().getEvents().stream()
                .filter(e -> e.getType() == TraceEventType.EXECUTION_LIMIT)
                .count();
        assertEquals(1, limitEventCount);
    }

    @Test
    public void testExecutionFailure() {
        Scenario scenario = Scenario.builder()
                .id(UUID.randomUUID())
                .userPrompt("Fail test")
                .build();

        when(agentSimulationService.getNextAgentAction(anyString(), anyString(), any(ExecutionTrace.class)))
                .thenThrow(new RuntimeException("Simulated LLM failure"));

        ExecutionResult result = executionHarnessService.executeScenario(scenario, "system prompt", "[]");

        assertFalse(result.isCompleted());
        assertFalse(result.isTerminatedByLimit());
        
        long errorEventCount = result.getTrace().getEvents().stream()
                .filter(e -> e.getType() == TraceEventType.ERROR)
                .count();
        assertEquals(1, errorEventCount);
    }
}
