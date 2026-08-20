CREATE TABLE test_suite (
    id UUID PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    tools JSONB,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE test_result (
    id UUID PRIMARY KEY,
    suite_id UUID NOT NULL,
    scenario_type VARCHAR(255),
    user_prompt TEXT,
    passed BOOLEAN,
    failure_mode VARCHAR(255),
    reasoning TEXT,
    trace JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (suite_id) REFERENCES test_suite(id)
);
