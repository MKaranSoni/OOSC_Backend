package com.reliabilityengine.service;

import com.reliabilityengine.entity.TestResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ReliabilityServiceTest {

    private ReliabilityService reliabilityService;

    @BeforeEach
    public void setup() {
        reliabilityService = new ReliabilityService();
    }

    @Test
    public void testEmptyResults() {
        assertEquals(0, reliabilityService.calculateReliabilityScore(null));
        assertEquals(0, reliabilityService.calculateReliabilityScore(new ArrayList<>()));
    }

    @Test
    public void testAllPassed() {
        List<TestResult> results = new ArrayList<>();
        results.add(TestResult.builder().passed(true).build());
        results.add(TestResult.builder().passed(true).build());
        
        assertEquals(100, reliabilityService.calculateReliabilityScore(results));
    }

    @Test
    public void testMixedResults() {
        List<TestResult> results = new ArrayList<>();
        results.add(TestResult.builder().passed(true).build());
        results.add(TestResult.builder().passed(false).build());
        results.add(TestResult.builder().passed(true).build());
        results.add(TestResult.builder().passed(false).build());
        
        assertEquals(50, reliabilityService.calculateReliabilityScore(results));
    }
    
    @Test
    public void testPartialResultsWithRounding() {
        List<TestResult> results = new ArrayList<>();
        results.add(TestResult.builder().passed(true).build());
        results.add(TestResult.builder().passed(false).build());
        results.add(TestResult.builder().passed(false).build());
        
        // 1/3 = 33%
        assertEquals(33, reliabilityService.calculateReliabilityScore(results));
    }
}
