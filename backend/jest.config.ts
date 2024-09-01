import type { Config } from "jest";

const config: Config = {
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // The root directory that Jest should scan for tests and modules within
    rootDir: "./src/__test__",

    // The glob patterns Jest uses to detect test files
    testMatch: ["**/__tests__/**/*.(test|spec).ts", "**/?(*.)+(test|spec).ts"],

    // Specifies the file extensions Jest will process
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

    // Transformations that Jest should apply to files
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },

    // The test environment that will be used for testing
    testEnvironment: "node",

    // Custom global setup for testing
    setupFilesAfterEnv: ["<rootDir>/setup/jest.setup.ts"],

    // An array of file extensions to test
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy",
    },

    // Verbose mode for more detailed test results
    verbose: true,
};

export default config;
