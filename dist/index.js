export * from './types.js';
export * from './compat/index.js';
export { registerEnsity, DENSITY_FUNCTIONS as ENSITY_DENSITY_FUNCTIONS } from './mods/ensity/index.js';
export { registerLithostitched, DENSITY_FUNCTIONS as LITHOSTITCHED_DENSITY_FUNCTIONS } from './mods/lithostitched/index.js';
export { registerMoredfs, DENSITY_FUNCTIONS as MOREDFS_DENSITY_FUNCTIONS } from './mods/moredfs/index.js';
export { registerTectonic, DENSITY_FUNCTIONS as TECTONIC_DENSITY_FUNCTIONS } from './mods/tectonic/index.js';
export { registerIkbLibrary, DENSITY_FUNCTIONS as IKBLIBRARY_DENSITY_FUNCTIONS } from './mods/ikblibrary/index.js';
export { registerLarion, DENSITY_FUNCTIONS as LARION_DENSITY_FUNCTIONS } from './mods/larion/index.js';
import { registerEnsity, DENSITY_FUNCTIONS as ensityFunctions } from './mods/ensity/index.js';
import { registerLithostitched, DENSITY_FUNCTIONS as lithostitchedFunctions } from './mods/lithostitched/index.js';
import { registerMoredfs, DENSITY_FUNCTIONS as moredfsFunctions } from './mods/moredfs/index.js';
import { registerTectonic, DENSITY_FUNCTIONS as tectonicFunctions } from './mods/tectonic/index.js';
import { registerIkbLibrary, DENSITY_FUNCTIONS as ikbLibraryFunctions } from './mods/ikblibrary/index.js';
import { registerLarion, DENSITY_FUNCTIONS as larionFunctions } from './mods/larion/index.js';
/**
 * Combined dictionary of all mod density functions.
 */
export const ALL_DENSITY_FUNCTIONS = {
    ...ensityFunctions,
    ...lithostitchedFunctions,
    ...moredfsFunctions,
    ...tectonicFunctions,
    ...ikbLibraryFunctions,
    ...larionFunctions,
};
/**
 * Registers all supported mod density functions and registries into the provided registry.
 */
export function registerAll(registry) {
    registerEnsity(registry);
    registerLithostitched(registry);
    registerMoredfs(registry);
    registerTectonic(registry);
    registerIkbLibrary(registry);
    registerLarion(registry);
}
export default registerAll;
//# sourceMappingURL=index.js.map