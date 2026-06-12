// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const testingLibrary = require('eslint-plugin-testing-library')
const jest = require('eslint-plugin-jest')

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    ignores: ['**/*.spec.ts', '**/*.test.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    extends: [
      tseslint.configs.recommended
    ],
    plugins: { jest, 'testing-library': testingLibrary },
    rules: {
      ...jest.configs.recommended.rules,
      ...testingLibrary.configs.angular.rules,
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
]);
