package com.reliabilityengine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EvaluatorServiceTest {

    @Mock
    private LlmService llmService;

    @Mock
    private ResourceLoader resourceLoader;

    private ObjectMapper objectMapper = new ObjectMapper();
    private EvaluatorService evaluatorService;

    @BeforeEach
    public void setup() {
        when(resourceLoader.getResource(anyString())).thenReturn(new ByteArrayResource("evaluator-prompt".getBytes()));
        evaluatorService = new EvaluatorService(llmService, objectMapper, resourceLoader);
    }

    @Test
    public void testDeterministicToolCallLoop() {
        Scenario scenario = Scenario.builder().id(UUID.randomUUID()).userPrompt("test").build();
        
        List<TraceEvent> events = new ArrayList<>();
        events.add(TraceEvent.builder().type(TraceEventType.TOOL_CALL).build());
        events.add(TraceEvent.builder().type(TraceEventType.TOOL_CALL).build());
        ExecutionTrace trace = ExecutionTrace.builder().events(events).build();

        EvaluationResult result = evaluatorService.evaluate(scenario, trace, "system", "[]", true);

        assertFalse(result.isPassed());
        assertEquals(FailureMode.TOOL_CALL_LOOP, result.getFailureMode());
        
        // Ensure LLM was not called
        verify(llmService, never()).generateStructuredResponse(anyString(), anyString());
    }

    @Test
    public void testLLMValidEvaluation() throws Exception {
        Scenario scenario = Scenario.builder().id(UUID.randomUUID()).userPrompt("test").build();
        ExecutionTrace trace = ExecutionTrace.builder().events(new ArrayList<>()).build();

        EvaluationResult expectedResult = EvaluationResult.builder()
                .passed(false)
                .failureMode(FailureMode.UNSAFE_DESTRUCTIVE_ACTION)
                .reasoning("Destructive action attempted")
                .build();

        when(llmService.generateStructuredResponse(anyString(), anyString()))
                .thenReturn(objectMapper.writeValueAsString(expectedResult));

        EvaluationResult result = evaluatorService.evaluate(scenario, trace, "system", "[]", false);

        assertFalse(result.isPassed());
        assertEquals(FailureMode.UNSAFE_DESTRUCTIVE_ACTION, result.getFailureMode());
        assertEquals("Destructive action attempted", result.getReasoning());
    }

    @Test
    public void testLLMContradictionCoercionPassedButFailureMode() throws Exception {
        Scenario scenario = Scenario.builder().id(UUID.randomUUID()).userPrompt("test").build();
        ExecutionTrace trace = ExecutionTrace.builder().events(new ArrayList<>()).build();

        // Passed is true, but FailureMode is GOAL_DRIFT
        EvaluationResult badResult = EvaluationResult.builder()
                .passed(true)
                .failureMode(FailureMode.GOAL_DRIFT)
                .reasoning("Contradictory result")
                .build();

        when(llmService.generateStructuredResponse(anyString(), anyString()))
                .thenReturn(objectMapper.writeValueAsString(badResult));

        EvaluationResult result = evaluatorService.evaluate(scenario, trace, "system", "[]", false);

        // Coerced to passed=false
        assertFalse(result.isPassed());
        assertEquals(FailureMode.GOAL_DRIFT, result.getFailureMode());
    }
}
