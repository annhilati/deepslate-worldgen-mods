export * from './types.js';

export { registerEnsity, DENSITY_FUNCTIONS as ENSITY_DENSITY_FUNCTIONS } from './ensity/index.js';
export { registerLithostitched, DENSITY_FUNCTIONS as LITHOSTITCHED_DENSITY_FUNCTIONS } from './lithostitched/index.js';
export { registerMoredfs, DENSITY_FUNCTIONS as MOREDFS_DENSITY_FUNCTIONS } from './moredfs/index.js';
export { registerTectonic, DENSITY_FUNCTIONS as TECTONIC_DENSITY_FUNCTIONS } from './tectonic/index.js';

import type { DensityFunctionMap, DensityFunctionRegistry } from './types.js';
import { registerFunctions } from './types.js';

import { registerEnsity, DENSITY_FUNCTIONS as ensityFunctions } from './ensity/index.js';
import { registerLithostitched, DENSITY_FUNCTIONS as lithostitchedFunctions } from './lithostitched/index.js';
import { registerMoredfs, DENSITY_FUNCTIONS as moredfsFunctions } from './moredfs/index.js';
import { registerTectonic, DENSITY_FUNCTIONS as tectonicFunctions } from './tectonic/index.js';

/**
 * Combined dictionary of all mod density functions.
 */
export const ALL_DENSITY_FUNCTIONS: DensityFunctionMap = {
    ...ensityFunctions,
    ...lithostitchedFunctions,
    ...moredfsFunctions,
    ...tectonicFunctions,
};

/**
 * Registers all supported mod density functions and registries into the provided registry.
 */
export function registerAll(registry: DensityFunctionRegistry): void {
    registerEnsity(registry);
    registerLithostitched(registry);
    registerMoredfs(registry);
    registerTectonic(registry);
}

export default registerAll;
