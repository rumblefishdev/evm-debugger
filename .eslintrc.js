module.exports = {
    root: true,
    env: {
        es2022: true,
        jest: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        "import/ignore": ["node_modules"],
        "import/resolver": {
            typescript: "true"
        }
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:sonarjs/recommended",
        "plugin:import/typescript",
        "plugin:unicorn/recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    plugins: ["@typescript-eslint", "prettier", "sort-keys-fix", "import", "jest", "sonarjs", "react-hooks", "unicorn"],
    overrides: [
        {
            files: ["*slice.ts"],
            rules: {
                "no-param-reassign": "off"

            }
        },
        {
            files: ["*.tsx"],
            rules: {
                "react-hooks/exhaustive-deps": "error"
            }
        },
        {





            files: ["*.ts", "*.tsx"],
            rules: {
                "prettier/prettier": "error",
                //Typescript
                "@typescript-eslint/array-type": ["error", { "default": "array" }],
                "@typescript-eslint/consistent-generic-constructors": ["error", "type-annotation"],
                "@typescript-eslint/consistent-indexed-object-style": "error",
                "@typescript-eslint/consistent-type-assertions": "off",
                "@typescript-eslint/consistent-type-exports": "error",
                "@typescript-eslint/consistent-type-imports": "error",
                "@typescript-eslint/default-param-last": "error",
                "@typescript-eslint/method-signature-style": ["error", "property"],
                "@typescript-eslint/no-confusing-non-null-assertion": "error",
                "@typescript-eslint/no-duplicate-enum-values": "error",
                "@typescript-eslint/no-dynamic-delete": "error",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-empty-interface": "off",
                "@typescript-eslint/no-implied-eval": "error",
                "@typescript-eslint/no-loop-func": "error",
                "@typescript-eslint/no-unused-vars": "warn",
                "@typescript-eslint/no-useless-empty-export": "error",
                "@typescript-eslint/require-await": "error",
                "@typescript-eslint/no-duplicate-imports": "error",
                "@typescript-eslint/no-shadow": [
                    "error",
                    { "ignoreTypeValueShadow": true, "ignoreFunctionTypeParameterNameValueShadow": true }
                ],
                "@typescript-eslint/naming-convention": [
                    "error",
                    {
                        "selector": "interface",
                        "format": ["PascalCase"]
                    },
                    {
                        "selector": "class",
                        "format": ["PascalCase"]
                    },
                    {
                        "selector": "typeLike",
                        "format": ["PascalCase"]
                    },
                    {
                        "selector": "variable",
                        "types": ["boolean"],
                        "format": ["PascalCase"],
                        "prefix": ["is", "should", "has", "can", "did", "will"]
                    },
                    {
                        "selector": "typeParameter",
                        "format": ["PascalCase"]
                    },
                    {
                        "selector": "enum",
                        "format": ["PascalCase"]
                    }
                ]
            }
        },
        {
            files: ["types.ts", "*types.ts"],
            rules: {
                "no-unused-vars": "off"
            }
        },
        {
            files: ["*.test.ts", "*.test.tsx"],
            extends: ["plugin:jest/recommended"],
            rules: {
                "jest/expect-expect": "off"
            }
        }
    ],
    rules: {
        //Eslint rules
        //Rules that prevents possible logic errors

        "no-await-in-loop": "warn",
        "no-constant-binary-expression": "error",
        "no-promise-executor-return": "error",
        "no-self-compare": "error",
        "no-template-curly-in-string": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-use-before-define": "error",
        "require-atomic-updates": "error",

        //Rules that suggest alternate ways of doing things

        "curly": ["error", "multi"],
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-location": ["error", "property"],
        "eqeqeq": ["error", "always"],
        "id-denylist": ["error", "err", "e", "cb", "callback"],
        "no-bitwise": "error",
        "no-caller": "error",
        "no-confusing-arrow": "off",
        "no-console": "off",
        "no-continue": "off",
        "no-else-return": ["error", { "allowElseIf": false }],
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-semi": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-mixed-operators": "off",
        "no-multi-assign": "error",
        "no-nested-ternary": "off",
        "no-new-wrappers": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-throw-literal": "error",
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "object-shorthand": ["error", "always"],
        "prefer-const": "error",
        "prefer-destructuring": ["error", { "object": true, "array": false }],
        "prefer-object-spread": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "radix": "off",
        "yoda": ["error", "never"],
        "spaced-comment": ["error", "always"],

        //Sonar
        "sonarjs/no-duplicate-string": "off",

        //Sort keys fix
        "sort-keys-fix/sort-keys-fix": ["error", "desc", { "caseSensitive": false, "natural": true }],

        //Import
        "import/no-unresolved": "off",
        "import/named": "error",
        "import/default": "error",
        "import/no-absolute-path": "error",
        "import/no-dynamic-require": "error",
        "import/no-internal-modules": "off",
        "import/no-self-import": "error",
        "import/no-cycle": "error",
        "import/no-useless-path-segments": "error",
        "import/export": "error",
        "import/no-named-as-default": "error",
        "import/no-named-as-default-member": "error",
        "import/no-extraneous-dependencies": "off",
        "import/no-mutable-exports": "error",
        "import/no-unused-modules": "error",

        "import/first": "error",
        "import/exports-last": "error",
        "import/no-duplicates": "error",
        "import/newline-after-import": "error",
        "import/no-unassigned-import": "off",
        "import/no-named-default": "error",
        "import/no-anonymous-default-export": "error",
        "import/group-exports": "off",
        "import/order": ["error", { "groups": ["builtin", "external", "parent", "sibling", "index"], "newlines-between": "always" }],
        //Unicorn
        "unicorn/no-keyword-prefix": "error",
        "unicorn/consistent-destructuring": "warn",
        "unicorn/prefer-add-event-listener": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/filename-case": "off",
        "unicorn/no-null": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/prefer-at": "error",
        "unicorn/no-array-reduce": "off",
        "unicorn/number-literal-case": "off",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/prefer-logical-operator-over-ternary": "off",
        "unicorn/prevent-abbreviations": [
            "error",
            {
                "extendDefaultReplacements": false,
                "checkFilenames": false,
                "checkProperties": true,
                "replacements": {
                    "e": {
                        "error": true,
                        "event": true
                    },
                    "err": {
                        "error": true
                    },
                    "res": {
                        "response": true,
                        "result": true
                    },
                    "req": {
                        "request": true
                    },
                    "cmd": {
                        "command": true
                    },
                    "cb": {
                        "callback": true
                    },
                    "acc": {
                        "accumulator": true
                    },
                    "i": {
                        "index": true
                    },
                    "idx": {
                        "index": true
                    },
                    "el": {
                        "element": true
                    }
                }
            }
        ]
    }
}
