import { afterAll, beforeAll, jest } from "@jest/globals";

// Mock pg module before any tests run
jest.mock("pg");

// Global test setup
beforeAll(() => {
  // Suppress console logs during tests
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  } as any;
});

afterAll(() => {
  jest.restoreAllMocks();
});
