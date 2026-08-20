package com.reliabilityengine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluatorService {

    private final LlmService llmService;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    public EvaluationResult evaluate(Scenario scenario, ExecutionTrace trace, String systemPrompt, String toolsJson, boolean terminatedByLimit) {
        log.info("Evaluating Scenario ID: {}", scenario.getId());

        // Deterministic check for TOOL_CALL_LOOP
        if (terminatedByLimit) {
            long toolCallCount = trace.getEvents().stream()
                    .filter(e -> e.getType() == TraceEventType.TOOL_CALL)
                    .count();
            if (toolCallCount > 1) {
                log.info("Deterministic override: TOOL_CALL_LOOP detected for Scenario ID: {}", scenario.getId());
                return EvaluationResult.builder()
                        .passed(false)
                        .failureMode(FailureMode.TOOL_CALL_LOOP)
                        .reasoning("The agent repeatedly performed tool calls until reaching the execution limit.")
                        .build();
            }
        }

        String evaluatorSystemPrompt = loadSystemPrompt();
        String userPrompt = buildUserPrompt(systemPrompt, scenario, toolsJson, trace);

        try {
            String llmResponseStr = llmService.generateStructuredResponse(evaluatorSystemPrompt, userPrompt);
            EvaluationResult result = objectMapper.readValue(llmResponseStr, EvaluationResult.class);

            if (result.isPassed() && result.getFailureMode() != FailureMode.NONE) {
                log.warn("LLM contradiction: passed=true but failureMode={}. Coercing to passed=false.", result.getFailureMode());
                result.setPassed(false);
            } else if (!result.isPassed() && result.getFailureMode() == FailureMode.NONE) {
                log.warn("LLM contradiction: passed=false but failureMode=NONE. Coercing to failureMode=GOAL_DRIFT.");
                result.setFailureMode(FailureMode.GOAL_DRIFT);
            }

            return result;
        } catch (Exception e) {
            log.error("Failed to evaluate Scenario ID: {}", scenario.getId(), e);
            // Safe fallback
            return EvaluationResult.builder()
                    .passed(false)
                    .failureMode(FailureMode.GOAL_DRIFT)
                    .reasoning("Evaluation failed due to an internal error parsing LLM response: " + e.getMessage())
                    .build();
        }
    }

    private String buildUserPrompt(String systemPrompt, Scenario scenario, String toolsJson, ExecutionTrace trace) {
        try {
            return "Target System Prompt:\n" + systemPrompt + "\n\n" +
                   "Scenario:\n" + scenario.getUserPrompt() + "\n\n" +
                   "Available Tools:\n" + toolsJson + "\n\n" +
                   "Execution Trace:\n" + objectMapper.writeValueAsString(trace.getEvents());
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize execution trace for evaluation", e);
        }
    }

    private String loadSystemPrompt() {
        try {
            Resource resource = resourceLoader.getResource("classpath:prompts/evaluator-system.txt");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load evaluator system prompt", e);
        }
    }
}
