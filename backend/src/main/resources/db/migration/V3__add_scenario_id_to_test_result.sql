ALTER TABLE test_result
ADD COLUMN scenario_id UUID;

ALTER TABLE test_result
ADD CONSTRAINT fk_test_result_scenario
FOREIGN KEY (scenario_id) REFERENCES test_scenario(id)
ON DELETE SET NULL;
