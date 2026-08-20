# AI Agent Evaluation & Reliability Engine

A robust backend engine designed to safely evaluate the behavior, safety, and reliability of autonomous AI agents through simulated execution environments.

## Architecture & Pipeline

1. **Scenario Generator:** Receives an agent's configuration and leverages an LLM to generate 3-5 deterministic, categorized testing scenarios (`NORMAL`, `EDGE_CASE`, `ADVERSARIAL`).
2. **Execution Harness:** Simulates a live conversation utilizing the generated scenarios. 
    - **Strict Security:** NO REAL CODE IS EXECUTED. Intercepts all tool-calls deterministically and redirects them to a `MockToolService` to guarantee the engine never impacts production data or executes malicious payloads.
    - **Bound Control:** Operates with a `MAX_TURNS` parameter (default 3) to prevent agents from spiraling into infinite tool-call loops.
3. **Evaluator Engine:** A secondary LLM pass analyzes the secure execution trace against the original scenario goals to determine if the agent `passed` and logs explicit, structured failure modes (e.g., `UNSAFE_DESTRUCTIVE_ACTION`).
4. **Reliability Score:** Aggregates execution scenarios into a cohesive grade out of 100.

## Tech Stack

- **Java 21**
- **Spring Boot 3.x**
- **PostgreSQL** (Database)
- **Flyway** (Migrations)
- **Maven**
- **JUnit 5 / Mockito** (Testing)

## Security Note

> **CRITICAL:** This backend achieves agent simulation entirely via a `MockToolService`. Despite whatever URL, Python script, or SQL command may exist in a target agent's tool definitions, the Execution Harness will parse the schema name and inject a static JSON mock. **Under no circumstances does this engine execute arbitrary user-provided code, shell commands, or network HTTP payloads.**

## Environment Configuration

Configure the application by establishing these environment variables (a template is available at `.env.example`):

```bash
DB_URL=jdbc:postgresql://localhost:5432/reliability_engine
DB_USERNAME=postgres
DB_PASSWORD=password
FRONTEND_URL=http://localhost:3000
LLM_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-3.5-turbo
LLM_API_URL=https://api.openai.com/v1/chat/completions
```

## Local Development & Deployment

### PostgreSQL Setup
Ensure PostgreSQL is running locally and provision the database:
```sql
CREATE DATABASE reliability_engine;
```
Flyway will automatically generate the schema (`test_suite`, `test_scenario`, `test_result`) when Spring Boot starts.

### Maven Commands
*(Requires Java 21)*

Build and test:
```bash
mvn clean test
```

Start the application:
```bash
mvn spring-boot:run
```

### Docker
To run via Docker, standard Spring Boot Dockerfiles apply. Build the JAR, then run your image mapping environment variables and port 8080.

## API Endpoints

### 1. Health Check
```http
GET /health
```
Response:
```json
{
  "status": "UP"
}
```

### 2. Run Test Suite
```http
POST /api/run-suite
```
**Example Request:**
```json
{
  "agentName": "CustomerSupportBot",
  "systemPrompt": "You are a helpful customer support bot...",
  "tools": [
    {
      "name": "lookup_user",
      "description": "Look up user by ID"
    }
  ]
}
```
**Example Response:**
```json
{
  "suiteId": "a1b2c3d4-...",
  "status": "COMPLETED"
}
```

### 3. Retrieve Results
```http
GET /api/results/{suiteId}
```
**Example Response:**
```json
{
  "suiteId": "a1b2c3d4-...",
  "agentName": "CustomerSupportBot",
  "status": "COMPLETED",
  "score": 100,
  "passed": 3,
  "failed": 0,
  "total": 3,
  "results": [
    {
      "scenario_id": "e5f6g7h8-...",
      "scenario_type": "NORMAL",
      "user_prompt": "I need help with my account.",
      "passed": true,
      "failure_mode": "NONE",
      "reasoning": "The agent behaved appropriately.",
      "trace": {
        "events": [
          {
            "type": "USER_MESSAGE",
            "timestamp": "2026-08-20T12:00:00Z",
            "content": "I need help with my account."
          }
        ]
      }
    }
  ]
}
```
