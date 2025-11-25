import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        '^#/(.*)$': '<rootDir>/$1',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};

export default config;
