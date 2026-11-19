import type { DensityFunctionMap, DensityFunctionRegistry } from '../types.js';
export * from './lib.js';
export declare const DENSITY_FUNCTIONS: DensityFunctionMap;
/**
 * Registers all Larion density functions into the provided registry.
 */
export declare function registerLarion(registry: DensityFunctionRegistry): void;
export default registerLarion;
//# sourceMappingURL=index.d.ts.map