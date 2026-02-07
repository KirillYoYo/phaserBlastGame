// jest.config.mjs
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Vite + TypeScript пути
    moduleNameMapper: {
        '\\.(png|jpg|jpeg|gif|svg)$': 'jest-transform-stub',
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Файлы для тестов
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
    ],
}
