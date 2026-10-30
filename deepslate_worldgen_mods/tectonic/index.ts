import type { DensityFunctionMap, DensityFunctionRegistry } from '../types.js';
import { registerFunctions } from '../types.js';

import { TectonicConfigClamp, TectonicInvert  } from './lib.js';

export const DENSITY_FUNCTIONS: DensityFunctionMap = {
    'tectonic:config_clamp': TectonicConfigClamp.fromJson,
    'tectonic:invert': TectonicInvert.fromJson,
    'tectonic:config_constant': () => {
        throw new Error('tectonic:config_constant is not supported in preview yet');
    },
    'tectonic:config_noise': () => {
        throw new Error('tectonic:config_noise is not supported in preview yet');
    },
};

export function registerTectonic(registry: DensityFunctionRegistry): void {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}

export default registerTectonic;
