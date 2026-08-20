package com.reliabilityengine.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_suite")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestSuite {

    @Id
    private UUID id;

    @Column(name = "agent_name", nullable = false)
    private String agentName;

    @Column(name = "system_prompt", nullable = false, columnDefinition = "TEXT")
    private String systemPrompt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String tools;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;
}
