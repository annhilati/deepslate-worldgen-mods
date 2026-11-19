import { registerFunctions } from '../types.js';
import { LarionDivision, LarionFlatDomainWarp, LarionSignum, LarionSine, LarionSqrt, LarionXCoord, LarionZCoord, } from './lib.js';
export * from './lib.js';
export const DENSITY_FUNCTIONS = {
    'larion:div': LarionDivision.fromJson,
    'larion:flat_domain_warp': LarionFlatDomainWarp.fromJson,
    'larion:signum': LarionSignum.fromJson,
    'larion:sine': LarionSine.fromJson,
    'larion:sqrt': LarionSqrt.fromJson,
    'larion:x': LarionXCoord.fromJson,
    'larion:z': LarionZCoord.fromJson,
    'larion:x_coord': LarionXCoord.fromJson,
    'larion:z_coord': LarionZCoord.fromJson,
};
/**
 * Registers all Larion density functions into the provided registry.
 */
export function registerLarion(registry) {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}
export default registerLarion;
//# sourceMappingURL=index.js.map