import { defineConfig } from "eslint-define-config";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooksConfig from "eslint-plugin-react-hooks/configs/recommended.js";
import prettierConfig from "eslint-plugin-prettier";

export default defineConfig([
  {
    languageOptions: {
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2021,
        sourceType: 'module'
      },
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  pluginReactConfig,
  pluginReactHooksConfig,
  {
    plugins: {
      jsxA11y: pluginJsxA11y,
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["to"],
          aspects: ["noHref", "invalidHref", "preferButton"],
        },
      ],
      "linebreak-style": 0,
    },
  },
  prettierConfig,
]);