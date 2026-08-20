package com.reliabilityengine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_result")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suite_id", nullable = false)
    private TestSuite suite;

    @Column(name = "scenario_type")
    private String scenarioType;

    @Column(name = "user_prompt", columnDefinition = "TEXT")
    private String userPrompt;

    private Boolean passed;

    @Column(name = "failure_mode")
    private String failureMode;

    @Column(columnDefinition = "TEXT")
    private String reasoning;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String trace;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
}
