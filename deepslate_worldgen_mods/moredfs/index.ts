import type { DensityFunctionMap, DensityFunctionRegistry, InputParser } from '../types.js';
import { registerFunctions } from '../types.js';

import {
    MoredfsClamp,
    MoredfsClampedGradient,
    MoredfsCoord,
    MoredfsDerivative,
    MoredfsDistance,
    MoredfsDivisionBase,
    MoredfsDotProduct,
    MoredfsGappedSpiral,
    MoredfsGradientMagnitude,
    MoredfsImageTessellation,
    MoredfsMapped,
    MoredfsOrElse,
    MoredfsReciprocal,
    MoredfsShift,
    MoredfsValueNoise,
    divMaps,
    doubleMaps,
    mathMaps
} from './lib.js'

export const DENSITY_FUNCTIONS: DensityFunctionMap = {
    // 1-argument Math
    ...Object.fromEntries(
        Object.entries(mathMaps).map(([name, func]) => [
            `moredfs:${name}`,
            (obj: any, parser: InputParser) => new MoredfsMapped(parser(obj.input ?? obj.argument), func),
        ])
    ),
    'moredfs:clamp': MoredfsClamp.fromJson,

    // Division / Modulo
    ...Object.fromEntries(
        Object.entries(divMaps).map(([name, func]) => [
            `moredfs:${name}`,
            (obj: any, parser: InputParser) => new MoredfsDivisionBase(parser(obj.numerator ?? obj.argument1 ?? obj.argument), parser(obj.denominator ?? obj.argument2), func),
        ])
    ),
    'moredfs:reciprocal': MoredfsReciprocal.fromJson,

    // Double Arguments
    'moredfs:subtract': (obj: any, parser: InputParser) => new MoredfsDivisionBase(parser(obj.left ?? obj.argument1), parser(obj.right ?? obj.argument2), doubleMaps['subtract']),
    'moredfs:vector_angle': (obj: any, parser: InputParser) => new MoredfsDivisionBase(parser(obj.argument1 ?? obj.x), parser(obj.argument2 ?? obj.z), doubleMaps['vector_angle']),
    'moredfs:power': (obj: any, parser: InputParser) => new MoredfsDivisionBase(parser(obj.base ?? obj.argument1), parser(obj.exponent ?? obj.argument2), doubleMaps['power']),
    'moredfs:log': (obj: any, parser: InputParser) => new MoredfsDivisionBase(parser(obj.argument ?? obj.input), parser(obj.base), doubleMaps['log']),
    'moredfs:dot_product': MoredfsDotProduct.fromJson,

    // Coordinates
    'moredfs:x': MoredfsCoord.createParser('x'),
    'moredfs:y': MoredfsCoord.createParser('y'),
    'moredfs:z': MoredfsCoord.createParser('z'),
    'moredfs:radius': MoredfsCoord.createParser('radius'),
    'moredfs:radius_3d': MoredfsCoord.createParser('radius_3d'),
    'moredfs:polar_coords': MoredfsCoord.createParser('polar_coords'),

    // Advanced
    'moredfs:distance': MoredfsDistance.fromJson,
    'moredfs:derivative': MoredfsDerivative.fromJson,
    'moredfs:gradient_magnitude': MoredfsGradientMagnitude.fromJson,
    'moredfs:or_else': MoredfsOrElse.fromJson,
    'moredfs:profiler': (obj: any, parser: InputParser) => parser(obj.argument ?? obj.input),
    'moredfs:shift': MoredfsShift.fromJson,
    'moredfs:value_noise': MoredfsValueNoise.fromJson,
    'moredfs:single_channel_image_tessellation': MoredfsImageTessellation.fromJson,
    'moredfs:gapped_grid_square_spiral': MoredfsGappedSpiral.fromJson,
    'moredfs:x_clamped_gradient': MoredfsClampedGradient.createParser('x'),
    'moredfs:z_clamped_gradient': MoredfsClampedGradient.createParser('z'),
};

export function registerMoredfs(registry: DensityFunctionRegistry): void {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}

export default registerMoredfs;
