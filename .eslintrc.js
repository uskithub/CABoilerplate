module.exports = {
    env: {
        browser: true
        , es2021: true
        , node: true
    }
    , extends: [
        "eslint:recommended"
        , "plugin:vue/vue3-recommended"
        , "plugin:@typescript-eslint/recommended"
    ]
    , parser: "vue-eslint-parser"
    , parserOptions: {
        ecmaVersion: "latest"
        , parser: "@typescript-eslint/parser"
        , sourceType: "module"
    }
    , plugins: ["vue", "@typescript-eslint"]
    , rules: {
        indent: ["error", 4]
        , quotes: ["warn", "double"]
        , semi: ["warn", "always"]
        , "comma-style": ["warn", "first"]
        , "comma-spacing": ["warn", { before: false, after: true }]
        , "comma-dangle": ["warn", "never"]
        , "no-var": ["error"]
        , "no-console": ["off"]
        , "no-unused-vars": ["off"]
        , "no-mixed-spaces-and-tabs": ["warn"]
        , "no-warning-comments": ["warn", { terms: ["todo"], location: "anywhere" }]
    }
};
