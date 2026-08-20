package com.reliabilityengine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.dto.ScenarioGenerationResponse;
import com.reliabilityengine.dto.ScenarioResponse;
import com.reliabilityengine.entity.TestSuite;
import com.reliabilityengine.exception.ScenarioGenerationException;
import com.reliabilityengine.model.Scenario;
import com.reliabilityengine.model.ScenarioType;
import com.reliabilityengine.repository.ScenarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScenarioGeneratorService {

    private final LlmService llmService;
    private final ScenarioRepository scenarioRepository;
    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;
    private static final int MAX_RETRIES = 2;

    @Transactional
    public void generateScenarios(TestSuite suite, String agentName, String targetSystemPrompt, String toolsJson) {
        log.info("Started generating scenarios for suite ID: {}", suite.getId());

        String systemPrompt = loadSystemPrompt();
        String userPrompt = buildUserPrompt(agentName, targetSystemPrompt, toolsJson);

        ScenarioGenerationResponse generatedScenarios = attemptGeneration(systemPrompt, userPrompt);

        saveScenarios(suite, generatedScenarios.getScenarios());
        log.info("Successfully generated and saved {} scenarios for suite ID: {}", 
                generatedScenarios.getScenarios().size(), suite.getId());
    }

    private ScenarioGenerationResponse attemptGeneration(String systemPrompt, String userPrompt) {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                String llmResponseStr = llmService.generateStructuredResponse(systemPrompt, userPrompt);
                ScenarioGenerationResponse response = objectMapper.readValue(llmResponseStr, ScenarioGenerationResponse.class);
                validateScenarios(response.getScenarios());
                return response;
            } catch (Exception e) {
                log.warn("Attempt {} failed to generate/validate scenarios: {}", attempt, e.getMessage());
                if (attempt == MAX_RETRIES) {
                    throw new ScenarioGenerationException("Unable to generate evaluation scenarios.", e);
                }
            }
        }
        throw new ScenarioGenerationException("Unable to generate evaluation scenarios.");
    }

    private void validateScenarios(List<ScenarioResponse> scenarios) {
        if (scenarios == null) {
            throw new IllegalArgumentException("Scenarios list cannot be null.");
        }
        if (scenarios.size() < 3 || scenarios.size() > 5) {
            throw new IllegalArgumentException("Number of scenarios must be between 3 and 5.");
        }

        Set<String> uniquePrompts = new HashSet<>();
        boolean hasNormal = false;
        boolean hasEdgeCase = false;
        boolean hasAdversarial = false;

        for (ScenarioResponse scenario : scenarios) {
            if (scenario.getUserPrompt() == null || scenario.getUserPrompt().isBlank()) {
                throw new IllegalArgumentException("User prompt cannot be blank.");
            }
            if (!uniquePrompts.add(scenario.getUserPrompt().toLowerCase().trim())) {
                throw new IllegalArgumentException("Duplicate user prompts found.");
            }
            try {
                ScenarioType type = ScenarioType.valueOf(scenario.getScenarioType());
                if (type == ScenarioType.NORMAL) hasNormal = true;
                if (type == ScenarioType.EDGE_CASE) hasEdgeCase = true;
                if (type == ScenarioType.ADVERSARIAL) hasAdversarial = true;
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid scenario type: " + scenario.getScenarioType());
            }
        }

        if (!hasNormal || !hasEdgeCase || !hasAdversarial) {
            throw new IllegalArgumentException("Must include at least one NORMAL, one EDGE_CASE, and one ADVERSARIAL scenario.");
        }
    }

    private void saveScenarios(TestSuite suite, List<ScenarioResponse> scenarioResponses) {
        List<Scenario> scenarios = scenarioResponses.stream()
                .map(res -> Scenario.builder()
                        .id(UUID.randomUUID())
                        .suite(suite)
                        .scenarioType(ScenarioType.valueOf(res.getScenarioType()))
                        .userPrompt(res.getUserPrompt())
                        .description(res.getDescription())
                        .expectedRisk(res.getExpectedRisk())
                        .createdAt(ZonedDateTime.now(ZoneOffset.UTC))
                        .build())
                .collect(Collectors.toList());
        scenarioRepository.saveAll(scenarios);
    }

    private String buildUserPrompt(String agentName, String targetSystemPrompt, String toolsJson) {
        return "Target Agent Name: " + agentName + "\n\n" +
                "Target System Prompt:\n" + targetSystemPrompt + "\n\n" +
                "Target Tools Definition:\n" + toolsJson;
    }

    private String loadSystemPrompt() {
        try {
            Resource resource = resourceLoader.getResource("classpath:prompts/scenario-generator-system.txt");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new ScenarioGenerationException("Failed to load scenario generator system prompt", e);
        }
    }
}
