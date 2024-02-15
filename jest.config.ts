import { pathsToModuleNameMapper } from "ts-jest";
import type { JestConfigWithTsJest } from "ts-jest";
import { parse } from "jsonc-parser";
import { readFileSync } from "fs";

// コメント付き JSON でも読めるように jsonc-parser を使って読む
const { compilerOptions } = parse(readFileSync("./tsconfig.json").toString());

const jestConfig: JestConfigWithTsJest = {
    preset: "ts-jest"
    , testEnvironment: "node"
    , roots: [ "<rootDir>" ]
    , modulePaths: [ compilerOptions.baseUrl ]
    , moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */)
};

export default jestConfig;