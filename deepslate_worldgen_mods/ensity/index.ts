import type { DensityFunctionMap, DensityFunctionRegistry } from '../types.js';
import { registerFunctions } from '../types.js';

import { EnsityLonelyIsland, EnsityFloatingIslands } from './lib.js';

export const DENSITY_FUNCTIONS: DensityFunctionMap = {
    'msg:lonely_island': EnsityLonelyIsland.fromJson,
    'msg:floating_islands': EnsityFloatingIslands.fromJson,
};

export function registerEnsity(registry: DensityFunctionRegistry): void {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}

export default registerEnsity;
