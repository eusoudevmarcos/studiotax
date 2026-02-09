import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Não exige remoção de variáveis não usadas: desativa a regra
      "@typescript-eslint/no-unused-vars": "off",
      // Alternativa mais suave: apenas aviso e ignora vars que começam com _
      // "@typescript-eslint/no-unused-vars": ["warn", {
      //   "argsIgnorePattern": "^_",
      //   "varsIgnorePattern": "^_",
      //   "caughtErrorsIgnorePattern": "^_",
      // }],
    },
  },
];

export default eslintConfig;
