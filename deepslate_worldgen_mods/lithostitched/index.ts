import type { DensityFunctionMap, DensityFunctionRegistry } from '../types.js';
import { registerFunctions } from '../types.js';

import {
    LithostitchedSqrt,
    LithostitchedAxis,
    LithostitchedCeil,
    LithostitchedCos,
    LithostitchedFastNoise,
    LithostitchedFloor,
    LithostitchedMarker,
    LithostitchedMix,
    LithostitchedSelect,
    LithostitchedShift,
    LithostitchedSin,
    ensureFastNoiseRegistry
} from './lib.js';

export const DENSITY_FUNCTIONS: DensityFunctionMap = {
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

export function registerLithostitched(registry: DensityFunctionRegistry): void {
    ensureFastNoiseRegistry();
    registerFunctions(registry, DENSITY_FUNCTIONS);
}

export default registerLithostitched;
