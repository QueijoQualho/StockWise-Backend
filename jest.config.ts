import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/application/config/$1',
    '^@controller/(.*)$': '<rootDir>/src/application/controller/$1',
    '^@routes/(.*)$': '<rootDir>/src/application/routes/$1',
    '^@service/(.*)$': '<rootDir>/src/application/service/$1',
    '^@validation/(.*)$': '<rootDir>/src/application/validation/$1',
    '^@utils/(.*)$': '<rootDir>/src/application/utils/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/application/utils/interfaces/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@model/(.*)$': '<rootDir>/src/domain/model/$1',
    '^@repository/(.*)$': '<rootDir>/src/domain/repository/$1',
    '^@dto/(.*)$': '<rootDir>/src/domain/dto/$1',
  },
  // collectCoverage: true,
  // collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  // coverageDirectory: 'coverage',
  // coverageReporters: ['text', 'lcov'],
};

export default config;
