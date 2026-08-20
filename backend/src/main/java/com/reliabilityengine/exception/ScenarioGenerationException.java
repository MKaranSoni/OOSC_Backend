package com.reliabilityengine.exception;

public class ScenarioGenerationException extends RuntimeException {
    public ScenarioGenerationException(String message) {
        super(message);
    }
    
    public ScenarioGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}
