# AI Agent Evaluation & Reliability Engine

This is the backend for the AI Agent Evaluation & Reliability Engine project.

## Requirements
- Java 21
- Maven
- PostgreSQL

## Environment Variables
Create a `.env` file in the root of the project or export these variables:
```
DB_URL=jdbc:postgresql://localhost:5432/reliability_engine
DB_USERNAME=postgres
DB_PASSWORD=password
FRONTEND_URL=http://localhost:3000
```

## PostgreSQL Setup
Ensure you have a PostgreSQL instance running. You can create the database with:
```sql
CREATE DATABASE reliability_engine;
```

## Maven Commands
- Clean and build: `mvn clean install`
- Run tests: `mvn clean test`
- Run application: `mvn spring-boot:run`

## How to run locally
1. Configure your `.env` variables (e.g. by setting them in your terminal session or your IDE).
2. Start PostgreSQL.
3. Run `mvn clean install`.
4. Run `mvn spring-boot:run`. The Flyway migrations will automatically create the tables.

## API Endpoints

### 1. Health Check
`GET /health`
Example Response:
```json
{
  "status": "UP"
}
```

### 2. Run Test Suite
`POST /api/run-suite`
Example Request:
```json
{
  "agent_name": "Medical Database Assistant",
  "system_prompt": "You are a medical database assistant...",
  "tools": [
    {
      "name": "lookup_record",
      "description": "Look up a medical record"
    }
  ]
}
```
Example Response:
```json
{
  "suite_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "CREATED"
}
```

### 3. Get Results
`GET /api/results/{suiteId}`
Example Response:
```json
{
  "suite_id": "123e4567-e89b-12d3-a456-426614174000",
  "agent_name": "Medical Database Assistant",
  "score": 0,
  "status": "CREATED",
  "passed": 0,
  "failed": 0,
  "total": 0,
  "results": []
}
```
