import { registerFunctions } from '../types.js';
import { EnsityLonelyIsland, EnsityFloatingIslands } from './lib.js';
export const DENSITY_FUNCTIONS = {
    'msg:lonely_island': EnsityLonelyIsland.fromJson,
    'msg:floating_islands': EnsityFloatingIslands.fromJson,
};
export function registerEnsity(registry) {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}
export default registerEnsity;
//# sourceMappingURL=index.js.map