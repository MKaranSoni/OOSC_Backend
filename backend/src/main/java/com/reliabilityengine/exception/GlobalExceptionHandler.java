package com.reliabilityengine.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> createErrorResponse(String error, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", error);
        response.put("message", message);
        response.put("timestamp", java.time.ZonedDateTime.now(java.time.ZoneOffset.UTC).toString());
        return response;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = createErrorResponse("VALIDATION_ERROR", "Invalid request");
        Map<String, String> details = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            details.put(fieldName, errorMessage);
        });
        
        response.put("details", details);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SuiteNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleSuiteNotFoundException(SuiteNotFoundException ex) {
        return new ResponseEntity<>(createErrorResponse("SUITE_NOT_FOUND", ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>(createErrorResponse("MALFORMED_JSON", "Request body is malformed or invalid"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ScenarioGenerationException.class)
    public ResponseEntity<Map<String, Object>> handleScenarioGenerationException(ScenarioGenerationException ex) {
        return new ResponseEntity<>(createErrorResponse("SCENARIO_GENERATION_FAILED", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        return new ResponseEntity<>(createErrorResponse("INTERNAL_SERVER_ERROR", "An unexpected error occurred"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
