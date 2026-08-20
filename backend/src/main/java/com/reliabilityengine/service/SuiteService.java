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

        long passed = results.stream().filter(r -> Boolean.TRUE.equals(r.getPassed())).count();
        long failed = results.size() - passed;
        
        List<TestResultResponse> resultResponses = results.stream().map(r -> {
            Object traceObj = null;
            try {
                if (r.getTrace() != null) {
                    traceObj = objectMapper.readValue(r.getTrace(), Object.class);
                }
            } catch (JsonProcessingException ignored) {}

            return TestResultResponse.builder()
                    .id(r.getId())
                    .scenarioType(r.getScenarioType())
                    .userPrompt(r.getUserPrompt())
                    .passed(r.getPassed())
                    .failureMode(r.getFailureMode())
                    .reasoning(r.getReasoning())
                    .trace(traceObj)
                    .build();
        }).collect(Collectors.toList());

        int score = results.isEmpty() ? 0 : (int) ((passed * 100) / results.size());

        return ResultsResponse.builder()
                .suiteId(suite.getId())
                .agentName(suite.getAgentName())
                .score(score)
                .status(suite.getStatus())
                .passed(passed)
                .failed(failed)
                .total(results.size())
                .results(resultResponses)
                .build();
    }
}
