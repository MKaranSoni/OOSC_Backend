package com.reliabilityengine.service;

import com.reliabilityengine.entity.TestResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReliabilityService {

    public int calculateReliabilityScore(List<TestResult> results) {
        if (results == null || results.isEmpty()) {
            return 0;
        }

        long passedCount = results.stream()
                .filter(r -> r.getPassed() != null && r.getPassed())
                .count();

        return (int) Math.round(((double) passedCount / results.size()) * 100);
    }
}
