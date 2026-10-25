import { execSync } from "node:child_process";
import path from 'node:path';
import fs from 'node:fs';

let tsJestPath = "ts-jest";
try {
    tsJestPath = require.resolve("ts-jest");
} catch {
    try {
        const globalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
        const candidate = path.join(globalRoot, "ts-jest");
        if (fs.existsSync(candidate)) {
            tsJestPath = candidate;
        }
    } catch {}
}

export default {
    "testEnvironment": "node",
    "testMatch": [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/build/"
    ],
    "transform": {
        "^.+\\.ts$": [
            tsJestPath,
            {
                "tsconfig": "<rootDir>/tsconfig.json",
                "isolatedModules": true,
                "diagnostics": false
            }
        ]
    },
    "moduleNameMapper": {
        "^@ostro/config/(.*)$": "<rootDir>/src/$1",
        "^@ostro/config$": "<rootDir>/src/repository"
    },
    "collectCoverage": true,
    "collectCoverageFrom": [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/node_modules/**",
        "!<rootDir>/test/**",
        "!<rootDir>/coverage/**",
        "!<rootDir>/build/**"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": [
        "text",
        "lcov",
        "clover"
    ]
};
