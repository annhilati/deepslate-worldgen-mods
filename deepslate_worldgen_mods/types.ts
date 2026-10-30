import type { DensityFunction } from 'deepslate';

export type InputParser = (obj: unknown) => DensityFunction;

export type DensityFunctionParser = (
    obj: any,
    inputParser: InputParser
) => DensityFunction;

export type DensityFunctionMap = Record<string, DensityFunctionParser>;

export interface DensityFunctionRegistry {
    set(id: string, factory: DensityFunctionParser): void;
}

/**
 * Utility to register a map of density function parsers into a registry or Map.
 */
export function registerFunctions(
    registry: DensityFunctionRegistry,
    functions: DensityFunctionMap
): void {
    for (const [id, factory] of Object.entries(functions)) {
        registry.set(id, factory);
    }
}
