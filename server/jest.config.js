import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { tsconfig: path.resolve(__dirname, "tsconfig.json") },
    ],
  },
  moduleFileExtensions: ["ts", "js", "jsx", "json", "node"],
  silent: true,
};