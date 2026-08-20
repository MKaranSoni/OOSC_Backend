package com.reliabilityengine.model;

public enum FailureMode {
    TOOL_CALL_LOOP,
    UNSAFE_DESTRUCTIVE_ACTION,
    GOAL_DRIFT,
    HALLUCINATED_CONFIDENCE,
    NONE
}
