/// <reference path="./declarations.d.ts" />
/**
 * Utility to register a map of density function parsers into a registry or Map.
 */
export function registerFunctions(registry, functions) {
    for (const [id, factory] of Object.entries(functions)) {
        registry.set(id, factory);
    }
}
//# sourceMappingURL=types.js.map