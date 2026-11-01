import { registerFunctions } from '../types.js';
import { LithostitchedSqrt, LithostitchedAxis, LithostitchedCeil, LithostitchedCos, LithostitchedFastNoise, LithostitchedFloor, LithostitchedMarker, LithostitchedMix, LithostitchedSelect, LithostitchedShift, LithostitchedSin, ensureFastNoiseRegistry } from './lib.js';
export const DENSITY_FUNCTIONS = {
    'lithostitched:sqrt': LithostitchedSqrt.fromJson,
    'lithostitched:axis': LithostitchedAxis.fromJson,
    'lithostitched:ceil': LithostitchedCeil.fromJson,
    'lithostitched:floor': LithostitchedFloor.fromJson,
    'lithostitched:sin': LithostitchedSin.fromJson,
    'lithostitched:cos': LithostitchedCos.fromJson,
    'lithostitched:mix': LithostitchedMix.fromJson,
    'lithostitched:select': LithostitchedSelect.fromJson,
    'lithostitched:shift': LithostitchedShift.fromJson,
    'lithostitched:original_marker': LithostitchedMarker.fromJson,
    'lithostitched:wrapped_marker': LithostitchedMarker.fromJson,
    'lithostitched:fast_noise': LithostitchedFastNoise.fromJson,
};
export function registerLithostitched(registry) {
    ensureFastNoiseRegistry();
    registerFunctions(registry, DENSITY_FUNCTIONS);
}
export default registerLithostitched;
//# sourceMappingURL=index.js.map