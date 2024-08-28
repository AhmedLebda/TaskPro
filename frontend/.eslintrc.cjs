module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "18.2" } },
    plugins: ["react-refresh", "@typescript-eslint"],
    rules: {
        "react/jsx-no-target-blank": "off",
        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": ["warn"],
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
        "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
        "react/jsx-no-duplicate-props": ["error", { ignoreCase: false }],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": [
            "error",
            { additionalHooks: "useMyCustomHook" },
        ],
    },
};
