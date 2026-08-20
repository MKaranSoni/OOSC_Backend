package com.reliabilityengine.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class ExecutionConfig {

    @Value("${execution.max-turns:3}")
    private int maxTurns;
}
