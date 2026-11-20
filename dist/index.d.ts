export * from './types.js';
export * from './compat/index.js';
export { registerEnsity, DENSITY_FUNCTIONS as ENSITY_DENSITY_FUNCTIONS } from './mods/ensity/index.js';
export { registerLithostitched, DENSITY_FUNCTIONS as LITHOSTITCHED_DENSITY_FUNCTIONS } from './mods/lithostitched/index.js';
export { registerMoredfs, DENSITY_FUNCTIONS as MOREDFS_DENSITY_FUNCTIONS } from './mods/moredfs/index.js';
export { registerTectonic, DENSITY_FUNCTIONS as TECTONIC_DENSITY_FUNCTIONS } from './mods/tectonic/index.js';
export { registerIkbLibrary, DENSITY_FUNCTIONS as IKBLIBRARY_DENSITY_FUNCTIONS } from './mods/ikblibrary/index.js';
export { registerLarion, DENSITY_FUNCTIONS as LARION_DENSITY_FUNCTIONS } from './mods/larion/index.js';
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