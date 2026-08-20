package com.reliabilityengine.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.dto.ResultsResponse;
import com.reliabilityengine.dto.RunSuiteRequest;
import com.reliabilityengine.dto.RunSuiteResponse;
import com.reliabilityengine.dto.TestResultResponse;
import com.reliabilityengine.entity.TestResult;
import com.reliabilityengine.entity.TestSuite;
import com.reliabilityengine.exception.SuiteNotFoundException;
import com.reliabilityengine.model.EvaluationResult;
import com.reliabilityengine.model.ExecutionResult;
import com.reliabilityengine.model.Scenario;
import com.reliabilityengine.repository.ScenarioRepository;
import com.reliabilityengine.repository.TestResultRepository;
import com.reliabilityengine.repository.TestSuiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuiteService {

    private final TestSuiteRepository testSuiteRepository;
    private final TestResultRepository testResultRepository;
    private final ObjectMapper objectMapper;
    private final ScenarioGeneratorService scenarioGeneratorService;
    private final ScenarioRepository scenarioRepository;
    private final ExecutionHarnessService executionHarnessService;
    private final EvaluatorService evaluatorService;
    private final ReliabilityService reliabilityService;

    @Transactional
    public RunSuiteResponse runSuite(RunSuiteRequest request) {
        String toolsJson = "[]";
        try {
            if (request.getTools() != null) {
                toolsJson = objectMapper.writeValueAsString(request.getTools());
            }
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid tools JSON format", e);
        }

        TestSuite suite = TestSuite.builder()
                .id(UUID.randomUUID())
                .agentName(request.getAgentName())
                .systemPrompt(request.getSystemPrompt())
                .tools(toolsJson)
                .status("CREATED")
                .createdAt(ZonedDateTime.now(ZoneOffset.UTC))
                .build();

        testSuiteRepository.save(suite);

        suite.setStatus("RUNNING");
        testSuiteRepository.save(suite);

        try {
            scenarioGeneratorService.generateScenarios(suite, suite.getAgentName(), suite.getSystemPrompt(), suite.getTools());
            
            List<Scenario> scenarios = scenarioRepository.findBySuiteId(suite.getId());
            
            for (Scenario scenario : scenarios) {
                ExecutionResult execResult = executionHarnessService.executeScenario(scenario, suite.getSystemPrompt(), suite.getTools());
                
                String traceJson = null;
                try {
                    if (execResult.getTrace() != null) {
                        traceJson = objectMapper.writeValueAsString(execResult.getTrace());
                    }
                } catch (JsonProcessingException ignored) {}
                
                EvaluationResult evalResult = evaluatorService.evaluate(
                        scenario, 
                        execResult.getTrace(), 
                        suite.getSystemPrompt(), 
                        suite.getTools(), 
                        execResult.isTerminatedByLimit()
                );
                
                TestResult testResult = TestResult.builder()
                        .id(UUID.randomUUID())
                        .suite(suite)
                        .scenarioId(scenario.getId())
                        .scenarioType(scenario.getScenarioType().name())
                        .userPrompt(scenario.getUserPrompt())
                        .trace(traceJson)
                        .passed(evalResult.isPassed())
                        .failureMode(evalResult.getFailureMode().name())
                        .reasoning(evalResult.getReasoning())
                        .createdAt(ZonedDateTime.now(ZoneOffset.UTC))
                        .build();
                        
                testResultRepository.save(testResult);
            }
            
            List<TestResult> allResults = testResultRepository.findBySuiteId(suite.getId());
            int reliabilityScore = reliabilityService.calculateReliabilityScore(allResults);
            // Log the reliability score
            
            suite.setStatus("COMPLETED");
            testSuiteRepository.save(suite);
        } catch (Exception e) {
            suite.setStatus("FAILED");
            testSuiteRepository.save(suite);
            throw e;
        }

        return RunSuiteResponse.builder()
                .suiteId(suite.getId())
                .status(suite.getStatus())
                .build();
    }

    @Transactional(readOnly = true)
    public ResultsResponse getResults(UUID suiteId) {
        TestSuite suite = testSuiteRepository.findById(suiteId)
                .orElseThrow(() -> new SuiteNotFoundException("Suite not found with id: " + suiteId));

        List<TestResult> results = testResultRepository.findBySuiteId(suiteId);
        
        // Deterministic sorting based on createdAt
        results.sort(java.util.Comparator.comparing(TestResult::getCreatedAt));

        List<TestResultResponse> testResultResponses = results.stream().map(r -> {
            Object traceObj = null;
            try {
                if (r.getTrace() != null) {
                    traceObj = objectMapper.readValue(r.getTrace(), Object.class);
                }
            } catch (JsonProcessingException ignored) {}

            return TestResultResponse.builder()
                    .scenarioId(r.getScenarioId())
                    .scenarioType(r.getScenarioType())
                    .userPrompt(r.getUserPrompt())
                    .passed(r.getPassed())
                    .failureMode(r.getFailureMode())
                    .reasoning(r.getReasoning())
                    .trace(traceObj)
                    .build();
        }).collect(Collectors.toList());

        int score = reliabilityService.calculateReliabilityScore(results);

        long passed = results.stream().filter(r -> Boolean.TRUE.equals(r.getPassed())).count();
        long failed = results.size() - passed;

        return ResultsResponse.builder()
                .suiteId(suite.getId())
                .agentName(suite.getAgentName())
                .score(score)
                .status(suite.getStatus())
                .passed(passed)
                .failed(failed)
                .total(results.size())
                .results(testResultResponses)
                .build();
    }
}
