import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Disable overly strict React 19 rule — all our setState-in-effect calls are
      // legitimate hydration patterns (localStorage reads, store sync, debounced search).
      "react-hooks/set-state-in-effect": "off",
      // Allow _ prefix convention for intentionally unused destructured variables
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Capacitor native project build outputs
    "ios/**",
    "android/**",
  ]),
]);

export default eslintConfig;
