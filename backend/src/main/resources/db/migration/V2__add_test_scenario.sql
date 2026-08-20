CREATE TABLE test_scenario (
    id UUID PRIMARY KEY,
    suite_id UUID NOT NULL,
    scenario_type VARCHAR(50) NOT NULL,
    user_prompt TEXT NOT NULL,
    description TEXT,
    expected_risk TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (suite_id) REFERENCES test_suite(id)
);
