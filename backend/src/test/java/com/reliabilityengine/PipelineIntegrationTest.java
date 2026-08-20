package com.reliabilityengine;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.dto.RunSuiteRequest;
import com.reliabilityengine.model.EvaluationResult;
import com.reliabilityengine.model.FailureMode;
import com.reliabilityengine.model.ScenarioType;
import com.reliabilityengine.service.LlmService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PipelineIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LlmService llmService;

    @Test
    public void testCompletePipeline() throws Exception {
        // 1. Mock Scenario Generator LLM response
        String mockScenariosJson = """
            {
              "scenarios": [
                {
                  "scenario_type": "NORMAL",
                  "user_prompt": "Test Normal",
                  "description": "Desc",
                  "expected_risk": "None"
                },
                {
                  "scenario_type": "EDGE_CASE",
                  "user_prompt": "Test Edge",
                  "description": "Desc",
                  "expected_risk": "None"
                },
                {
                  "scenario_type": "ADVERSARIAL",
                  "user_prompt": "Test Adversarial",
                  "description": "Desc",
                  "expected_risk": "None"
                }
              ]
            }
        """;

        // 2. Mock Agent Simulation LLM response
        String mockAgentActionJson = """
            {
              "content": "I finished the task."
            }
        """;

        // 3. Mock Evaluator LLM response
        EvaluationResult evalResult = EvaluationResult.builder()
                .passed(true)
                .failureMode(FailureMode.NONE)
                .reasoning("Perfect.")
                .build();
        String mockEvaluatorJson = objectMapper.writeValueAsString(evalResult);

        // Sequence of LLM calls: 1 Scenario Gen, 3 Agent Sims, 3 Evaluations
        when(llmService.generateStructuredResponse(anyString(), anyString()))
                .thenReturn(mockScenariosJson)
                .thenReturn(mockAgentActionJson)
                .thenReturn(mockAgentActionJson)
                .thenReturn(mockAgentActionJson)
                .thenReturn(mockEvaluatorJson)
                .thenReturn(mockEvaluatorJson)
                .thenReturn(mockEvaluatorJson);

        RunSuiteRequest request = RunSuiteRequest.builder()
                .agentName("TestAgent")
                .systemPrompt("Be helpful")
                .tools(List.of(Map.of("name", "tool_a", "description", "a tool")))
                .build();

        // Start Suite
        MvcResult runResult = mockMvc.perform(post("/api/run-suite")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andReturn();

        String runResponseStr = runResult.getResponse().getContentAsString();
        String suiteId = objectMapper.readTree(runResponseStr).path("suiteId").asText();

        // Get Results
        mockMvc.perform(get("/api/results/" + suiteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.total").value(3))
                .andExpect(jsonPath("$.passed").value(3))
                .andExpect(jsonPath("$.failed").value(0))
                .andExpect(jsonPath("$.score").value(100))
                .andExpect(jsonPath("$.results[0].scenario_type").exists())
                .andExpect(jsonPath("$.results[0].passed").value(true))
                .andExpect(jsonPath("$.results[0].failure_mode").value("NONE"))
                .andExpect(jsonPath("$.results[0].trace").exists());
    }
}
