package com.reliabilityengine.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reliabilityengine.dto.ResultsResponse;
import com.reliabilityengine.dto.RunSuiteRequest;
import com.reliabilityengine.dto.RunSuiteResponse;
import com.reliabilityengine.exception.SuiteNotFoundException;
import com.reliabilityengine.service.SuiteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SuiteController.class)
public class SuiteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SuiteService suiteService;

    @Test
    public void testRunSuiteValidData() throws Exception {
        UUID suiteId = UUID.randomUUID();
        RunSuiteResponse response = RunSuiteResponse.builder()
                .suiteId(suiteId)
                .status("CREATED")
                .build();
        when(suiteService.runSuite(any())).thenReturn(response);

        RunSuiteRequest request = new RunSuiteRequest();
        request.setAgentName("Test Agent");
        request.setSystemPrompt("You are a test agent.");
        
        List<Map<String, Object>> tools = new ArrayList<>();
        Map<String, Object> tool = new HashMap<>();
        tool.put("name", "test_tool");
        tool.put("description", "A test tool");
        tools.add(tool);
        request.setTools(tools);

        mockMvc.perform(post("/api/run-suite")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.suite_id").value(suiteId.toString()))
                .andExpect(jsonPath("$.status").value("CREATED"));
    }

    @Test
    public void testRunSuiteMissingAgentName() throws Exception {
        RunSuiteRequest request = new RunSuiteRequest();
        request.setSystemPrompt("You are a test agent.");
        request.setTools(new ArrayList<>());

        mockMvc.perform(post("/api/run-suite")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    public void testRunSuiteMissingSystemPrompt() throws Exception {
        RunSuiteRequest request = new RunSuiteRequest();
        request.setAgentName("Test Agent");
        request.setTools(new ArrayList<>());

        mockMvc.perform(post("/api/run-suite")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    public void testGetResultsValidSuiteId() throws Exception {
        UUID suiteId = UUID.randomUUID();
        ResultsResponse response = ResultsResponse.builder()
                .suiteId(suiteId)
                .agentName("Test Agent")
                .score(0)
                .status("CREATED")
                .passed(0)
                .failed(0)
                .total(0)
                .results(new ArrayList<>())
                .build();
        when(suiteService.getResults(suiteId)).thenReturn(response);

        mockMvc.perform(get("/api/results/" + suiteId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suite_id").value(suiteId.toString()))
                .andExpect(jsonPath("$.score").value(0))
                .andExpect(jsonPath("$.results").isEmpty());
    }

    @Test
    public void testGetResultsUnknownSuiteId() throws Exception {
        UUID suiteId = UUID.randomUUID();
        when(suiteService.getResults(suiteId)).thenThrow(new SuiteNotFoundException("Suite not found"));

        mockMvc.perform(get("/api/results/" + suiteId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }
}
