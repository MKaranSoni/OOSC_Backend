package com.reliabilityengine.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.dto.ScenarioGenerationResponse;
import com.reliabilityengine.dto.ScenarioResponse;
import com.reliabilityengine.entity.TestSuite;
import com.reliabilityengine.exception.ScenarioGenerationException;
import com.reliabilityengine.repository.ScenarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ResourceLoader;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ScenarioGeneratorServiceTest {

    @Mock
    private LlmService llmService;

    @Mock
    private ScenarioRepository scenarioRepository;

    @Mock
    private ResourceLoader resourceLoader;

    @Captor
    private ArgumentCaptor<List<com.reliabilityengine.model.Scenario>> scenarioCaptor;

    private ScenarioGeneratorService generatorService;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        objectMapper = new ObjectMapper();
        generatorService = new ScenarioGeneratorService(llmService, scenarioRepository, objectMapper, resourceLoader);
        when(resourceLoader.getResource(anyString())).thenReturn(new ByteArrayResource("test-system-prompt".getBytes()));
    }

    @Test
    public void testValidScenarioGeneration() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        
        List<ScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new ScenarioResponse("NORMAL", "prompt 1", "desc 1", "risk 1"));
        scenarios.add(new ScenarioResponse("EDGE_CASE", "prompt 2", "desc 2", "risk 2"));
        scenarios.add(new ScenarioResponse("ADVERSARIAL", "prompt 3", "desc 3", "risk 3"));
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        String jsonResponse = objectMapper.writeValueAsString(responseDto);

        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(jsonResponse);

        generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]");

        verify(scenarioRepository).saveAll(scenarioCaptor.capture());
        assertEquals(3, scenarioCaptor.getValue().size());
    }

    @Test
    public void testInvalidLLMJSON() {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn("invalid json");

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
        verify(llmService, times(2)).generateStructuredResponse(anyString(), anyString());
    }

    @Test
    public void testFewerThan3Scenarios() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        List<ScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new ScenarioResponse("NORMAL", "prompt 1", "desc 1", "risk 1"));
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(objectMapper.writeValueAsString(responseDto));

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
    }

    @Test
    public void testMoreThan5Scenarios() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        List<ScenarioResponse> scenarios = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            scenarios.add(new ScenarioResponse("NORMAL", "prompt " + i, "desc", "risk"));
        }
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(objectMapper.writeValueAsString(responseDto));

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
    }

    @Test
    public void testMissingScenarioType() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        List<ScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new ScenarioResponse("NORMAL", "prompt 1", "desc 1", "risk 1"));
        scenarios.add(new ScenarioResponse("EDGE_CASE", "prompt 2", "desc 2", "risk 2"));
        scenarios.add(new ScenarioResponse("NORMAL", "prompt 3", "desc 3", "risk 3"));
        // Missing ADVERSARIAL
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(objectMapper.writeValueAsString(responseDto));

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
    }

    @Test
    public void testBlankUserPrompt() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        List<ScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new ScenarioResponse("NORMAL", "", "desc 1", "risk 1"));
        scenarios.add(new ScenarioResponse("EDGE_CASE", "prompt 2", "desc 2", "risk 2"));
        scenarios.add(new ScenarioResponse("ADVERSARIAL", "prompt 3", "desc 3", "risk 3"));
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(objectMapper.writeValueAsString(responseDto));

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
    }

    @Test
    public void testDuplicatePrompts() throws Exception {
        TestSuite suite = TestSuite.builder().id(UUID.randomUUID()).build();
        List<ScenarioResponse> scenarios = new ArrayList<>();
        scenarios.add(new ScenarioResponse("NORMAL", "duplicate prompt", "desc 1", "risk 1"));
        scenarios.add(new ScenarioResponse("EDGE_CASE", "duplicate prompt", "desc 2", "risk 2"));
        scenarios.add(new ScenarioResponse("ADVERSARIAL", "prompt 3", "desc 3", "risk 3"));
        
        ScenarioGenerationResponse responseDto = new ScenarioGenerationResponse(scenarios);
        when(llmService.generateStructuredResponse(anyString(), anyString())).thenReturn(objectMapper.writeValueAsString(responseDto));

        assertThrows(ScenarioGenerationException.class, () -> 
            generatorService.generateScenarios(suite, "TestAgent", "SystemPrompt", "[]")
        );
    }
}
