package com.reliabilityengine.model;

import com.reliabilityengine.entity.TestSuite;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_scenario")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Scenario {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suite_id", nullable = false)
    private TestSuite suite;

    @Enumerated(EnumType.STRING)
    @Column(name = "scenario_type", nullable = false)
    private ScenarioType scenarioType;

    @Column(name = "user_prompt", nullable = false, columnDefinition = "TEXT")
    private String userPrompt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "expected_risk", columnDefinition = "TEXT")
    private String expectedRisk;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
}
