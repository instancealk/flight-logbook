import { describe, it } from "@jest/globals";

/**
 * TODO: Fix database mocking for repository tests
 *
 * ISSUE: PostgreSQL pool mocking is complex with TypeScript and Jest
 *
 * APPROACHES TO TRY WHEN FIXING:
 * 1. Use pg-mem (in-memory PostgreSQL) instead of mocking
 *    - npm install --save-dev pg-mem
 *    - Creates real PostgreSQL instance in memory
 *    - No mocking needed, just reset DB between tests
 *
 * 2. Use testcontainers with real PostgreSQL
 *    - npm install --save-dev @testcontainers/postgresql
 *    - Spins up real Postgres in Docker for tests
 *    - Slower but most realistic
 *
 * 3. Fix the manual mock approach
 *    - Mock pg module directly in __mocks__/pg.js
 *    - Ensure mock is applied before repository imports pool
 *    - Use jest.requireActual for proper module mocking
 *
 * REFERENCE:
 * - https://github.com/oguimbal/pg-mem (recommended)
 * - https://node-postgres.com/guides/project-structure
 * - https://jestjs.io/docs/manual-mocks
 *
 * For now, integration tests with real DB cover this layer.
 */

describe.skip("FlightRepository", () => {
  it.todo("should create a flight successfully");
  it.todo("should find flight by id");
  it.todo("should find flights by user id");
  it.todo("should update a flight");
  it.todo("should delete a flight");
  it.todo("should recalculate flight totals");
});
