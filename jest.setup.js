// Polyfill fetch for jsdom environment
require('whatwg-fetch');

// Patch Response to ensure headers are always properly initialized
// This fixes MSW v1 cookie handling issues in jsdom
const OriginalResponse = global.Response;
global.Response = class extends OriginalResponse {
  constructor(body, init) {
    super(body, init);
    // Ensure headers object is properly initialized
    if (!this.headers || typeof this.headers.get !== 'function') {
      Object.defineProperty(this, 'headers', {
        value: new Headers(init?.headers || {}),
        writable: false,
        configurable: true
      });
    }
  }
};

// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Mock Next.js router for all tests
jest.mock('next/navigation', () => require('next-router-mock'));

// Setup MSW v1 server for all tests
const { server } = require('./src/mocks/server');

beforeAll(() => {
  // Start MSW server before all tests
  server.listen({ onUnhandledRequest: 'warn' });
});

afterEach(() => {
  // Reset handlers after each test to ensure test isolation
  server.resetHandlers();
});

afterAll(() => {
  // Clean up and close the server after all tests
  server.close();
});
