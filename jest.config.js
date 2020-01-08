module.exports = {
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transform: {
        '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest',
        '^.+\\.(ts|tsx|spec.tsx)?$': 'ts-jest',
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
    testRegex: ['/__tests__/.*.spec.(js|ts|tsx)?$'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['build/'],
};
