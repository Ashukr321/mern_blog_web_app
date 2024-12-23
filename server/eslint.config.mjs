import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
 {
  rules: {
    "no-unused-vars": "off",
    "no-console": "off",
    "no-undef": "off",
    "no-unused-expressions": "off",
    "no-undef-init": "off",
    "no-prototype-builtins": "off",
    "no-restricted-globals": "off",
    "no-restricted-syntax": "off",
    "no-restricted-properties": "off",
    
    
 }

}
];