module.exports = {
  projects: [
    {
      displayName: "node",
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/**/*.spec.{js,jsx,ts,tsx}",
      ],
      preset: "ts-jest",
      transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
      },
    },
    {
      displayName: "jsdom",
      testEnvironment: "jsdom",
      preset: "ts-jest",
      testMatch: ["<rootDir>/**/*.test.{js,jsx,ts,tsx}"],
      transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
      },
    },
  ],
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts", // Exclude type definition files
    "!src/**/(mocks|types|styles)/**/*",
    "!src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
};
