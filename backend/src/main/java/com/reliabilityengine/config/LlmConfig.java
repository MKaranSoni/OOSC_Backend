package com.reliabilityengine.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class LlmConfig {

    @Value("${llm.api.key}")
    private String apiKey;

    @Value("${llm.api.model:gpt-3.5-turbo}")
    private String model;

    @Value("${llm.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;
}
