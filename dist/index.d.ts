export * from './types.js';
export { registerEnsity, DENSITY_FUNCTIONS as ENSITY_DENSITY_FUNCTIONS } from './ensity/index.js';
export { registerLithostitched, DENSITY_FUNCTIONS as LITHOSTITCHED_DENSITY_FUNCTIONS } from './lithostitched/index.js';
export { registerMoredfs, DENSITY_FUNCTIONS as MOREDFS_DENSITY_FUNCTIONS } from './moredfs/index.js';
export { registerTectonic, DENSITY_FUNCTIONS as TECTONIC_DENSITY_FUNCTIONS } from './tectonic/index.js';
export { registerIkbLibrary, DENSITY_FUNCTIONS as IKBLIBRARY_DENSITY_FUNCTIONS } from './ikblibrary/index.js';
import type { DensityFunctionMap, DensityFunctionRegistry } from './types.js';
/**
 * Combined dictionary of all mod density functions.
 */
export declare const ALL_DENSITY_FUNCTIONS: DensityFunctionMap;
/**
 * Registers all supported mod density functions and registries into the provided registry.
 */
export declare function registerAll(registry: DensityFunctionRegistry): void;
export default registerAll;
//# sourceMappingURL=index.d.ts.map