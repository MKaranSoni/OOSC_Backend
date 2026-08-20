package com.reliabilityengine.controller;

import com.reliabilityengine.dto.ResultsResponse;
import com.reliabilityengine.dto.RunSuiteRequest;
import com.reliabilityengine.dto.RunSuiteResponse;
import com.reliabilityengine.service.SuiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SuiteController {

    private final SuiteService suiteService;

    @PostMapping("/run-suite")
    public ResponseEntity<RunSuiteResponse> runSuite(@Valid @RequestBody RunSuiteRequest request) {
        RunSuiteResponse response = suiteService.runSuite(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/results/{suiteId}")
    public ResponseEntity<ResultsResponse> getResults(@PathVariable UUID suiteId) {
        ResultsResponse response = suiteService.getResults(suiteId);
        return ResponseEntity.ok(response);
    }
}
