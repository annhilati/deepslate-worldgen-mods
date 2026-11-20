import { registerFunctions } from '../types.js';
import { TectonicConfigClamp, TectonicInvert, TectonicConfigConstant, TectonicConfigNoise, } from './lib.js';
export * from './lib.js';
export const DENSITY_FUNCTIONS = {
    'tectonic:config_clamp': TectonicConfigClamp.fromJson,
    'tectonic:invert': TectonicInvert.fromJson,
    'tectonic:config_constant': TectonicConfigConstant.fromJson,
    'tectonic:config_noise': TectonicConfigNoise.fromJson,
};
export function registerTectonic(registry) {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}
export default registerTectonic;
//# sourceMappingURL=index.js.map