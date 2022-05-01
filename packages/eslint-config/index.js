module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    plugins: [
        "@typescript-eslint/eslint-plugin",
        "prettier"
    ],
    rules: {
        'prettier/prettier': 'error',
        quotes: ["error", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
        semi: ["error", "always"],
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-empty-function': 0,
        "import/no-cycle": [
            "error",
            {
                "maxDepth": Infinity,
                "ignoreExternal": true
            }
        ],
        "no-unused-vars": "off",
        "import/no-unresolved": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "vars": "local", "args": "none", "ignoreRestSiblings": true, "varsIgnorePattern": "^_" }]
    },
};
