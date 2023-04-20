// @see: https://qiita.com/ibara1454/items/be73615df332564e7855#plugins-%E3%81%A8-extends
// デフォルトを typescript 向けとし、Vue と GraphQL に対しては overrides で上書き
module.exports = {
    env: {
        browser: true
        , es2021: true
        , node: true
    }
    // for TypeScript @see: https://typescript-eslint.io/linting/configs
    , plugins: ["@typescript-eslint"]
    , extends: [
        "eslint:recommended"
        , "plugin:@typescript-eslint/recommended"
        , "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ]
    , parser: "@typescript-eslint/parser"
    , parserOptions: {
        ecmaVersion: "latest"
        , sourceType: "module"
        , project: ["./tsconfig.json"]
    }
    , rules: {
        indent: ["error", 4]
        , quotes: ["warn", "double"]
        , semi: ["warn", "always"]
        , "comma-style": ["warn", "first"]
        , "comma-spacing": ["warn", { before: false, after: true }]
        , "comma-dangle": ["warn", "never"]
        , "no-var": ["error"]
        , "no-console": ["off"]
        , "no-mixed-spaces-and-tabs": ["warn"]
        , "no-warning-comments": ["warn", { terms: ["todo"], location: "anywhere" }]
    }
    , overrides: [
        /** for Vue @see: https://eslint.vuejs.org/user-guide/ */
        { 
            files: ["./src/client/**/*.vue"]
            , plugins: ["vue"]
            , extends: [
                "plugin:vue/vue3-recommended"
                , "@vue/typescript/recommended"
            ]
            , parser: "vue-eslint-parser"
            // script部分のparserをtypescript-eslintにすると、vueファイルにて
            // 「The file must be included in at least one of the projects provided.」
            // が出るため、デフォルトのparserを使用する
            // , parserOptions: {
            //     parser: {
            //         ts : "@typescript-eslint/parser"
            //     }
            // }
            , rules: {
                "vue/script-indent": ["error", 4]
                , "vue/html-indent": ["error", 2]
            }
            
        }
        /** for GraphQL @see: https://the-guild.dev/graphql/eslint/docs/getting-started */
        , {
            files: ["*.js"]
            , processor: "@graphql-eslint/graphql"
        }
        , {
            files: ["./amplify/backend/api/caboilerplate/**/*.graphql"]
            , plugins: ["@graphql-eslint"]
            , extends: "plugin:@graphql-eslint/schema-recommended"
            , parser: "@graphql-eslint/eslint-plugin"
            , parserOptions: {
                schema: [
                    "./amplify/backend/api/caboilerplate/schema.graphql"
                    , "./amplify/backend/api/caboilerplate/schema/*.graphql"
                ]
                , skipGraphQLConfig: true
            }
        }
    ]
};
