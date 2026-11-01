import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';
export declare class MoredfsMapped extends DensityFunction {
    readonly input: DensityFunction;
    readonly func: (v: number) => number;
    constructor(input: DensityFunction, func: (v: number) => number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
}
export declare const mathMaps: Record<string, (v: number) => number>;
export declare class MoredfsClamp extends DensityFunction {
    readonly input: DensityFunction;
    readonly minVal: number;
    readonly maxVal: number;
    constructor(input: DensityFunction, minVal: number, maxVal: number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsClamp;
}
export declare class MoredfsDivisionBase extends DensityFunction {
    readonly arg1: DensityFunction;
    readonly arg2: DensityFunction;
    readonly func: (a: number, b: number) => number;
    constructor(arg1: DensityFunction, arg2: DensityFunction, func: (a: number, b: number) => number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
}
export declare const divMaps: Record<string, (a: number, b: number) => number>;
export declare class MoredfsReciprocal extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsReciprocal;
}
export declare const doubleMaps: Record<string, (a: number, b: number) => number>;
export declare class MoredfsDotProduct extends DensityFunction {
    readonly arg1: DensityFunction;
    readonly arg2: DensityFunction;
    readonly stepX: number;
    readonly stepY: number;
    readonly stepZ: number;
    constructor(arg1: DensityFunction, arg2: DensityFunction, stepX: number, stepY: number, stepZ: number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsDotProduct;
}
export declare class MoredfsCoord extends DensityFunction {
    readonly type: 'x' | 'y' | 'z' | 'radius' | 'radius_3d' | 'polar_coords';
    constructor(type: 'x' | 'y' | 'z' | 'radius' | 'radius_3d' | 'polar_coords');
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static createParser(type: 'x' | 'y' | 'z' | 'radius' | 'radius_3d' | 'polar_coords'): () => MoredfsCoord;
}
export declare class MoredfsDistance extends DensityFunction {
    readonly metric: string;
    readonly p1: DensityFunction[];
    readonly p2: DensityFunction[];
    constructor(metric: string, p1: DensityFunction[], p2: DensityFunction[]);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsDistance;
}
export declare class MoredfsDerivative extends DensityFunction {
    readonly argument: DensityFunction;
    readonly compX: {
        direction: DensityFunction;
        step: number;
    } | null;
    readonly compY: {
        direction: DensityFunction;
        step: number;
    } | null;
    readonly compZ: {
        direction: DensityFunction;
        step: number;
    } | null;
    constructor(argument: DensityFunction, compX: {
        direction: DensityFunction;
        step: number;
    } | null, compY: {
        direction: DensityFunction;
        step: number;
    } | null, compZ: {
        direction: DensityFunction;
        step: number;
    } | null);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsDerivative;
}
export declare class MoredfsGradientMagnitude extends DensityFunction {
    readonly argument: DensityFunction;
    readonly stepX: number;
    readonly stepY: number;
    readonly stepZ: number;
    constructor(argument: DensityFunction, stepX: number, stepY: number, stepZ: number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsGradientMagnitude;
}
export declare class MoredfsOrElse extends DensityFunction {
    readonly argument: DensityFunction;
    readonly fallback: DensityFunction;
    constructor(argument: DensityFunction, fallback: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsOrElse;
}
export declare class MoredfsShift extends DensityFunction {
    readonly argument: DensityFunction;
    readonly shiftX: DensityFunction | null;
    readonly shiftY: DensityFunction | null;
    readonly shiftZ: DensityFunction | null;
    constructor(argument: DensityFunction, shiftX: DensityFunction | null, shiftY: DensityFunction | null, shiftZ: DensityFunction | null);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsShift;
}
export declare class MoredfsValueNoise extends DensityFunction {
    readonly sizeX: number;
    readonly sizeY: number;
    readonly sizeZ: number;
    readonly interp: string;
    readonly salt: number;
    readonly samplerMin: number;
    readonly samplerMax: number;
    constructor(sizeX: number, sizeY: number, sizeZ: number, interp: string, salt: number, sampler: any);
    private hash;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any): MoredfsValueNoise;
}
export declare class MoredfsImageTessellation extends DensityFunction {
    readonly xSize: number;
    readonly zSize: number;
    readonly data: Uint8Array | null;
    constructor(xSize: number, zSize: number, b64Data: string);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any): MoredfsImageTessellation;
}
export declare class MoredfsGappedSpiral extends DensityFunction {
    readonly xSize: number;
    readonly zSize: number;
    readonly spacing: number;
    readonly gridCellArgs: DensityFunction[];
    readonly oobArg: DensityFunction;
    constructor(xSize: number, zSize: number, spacing: number, gridCellArgs: DensityFunction[], oobArg: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): MoredfsGappedSpiral;
}
export declare class MoredfsClampedGradient extends DensityFunction {
    readonly axis: 'x' | 'z';
    readonly from: number;
    readonly to: number;
    readonly fromV: number;
    readonly toV: number;
    constructor(axis: 'x' | 'z', from: number, to: number, fromV: number, toV: number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static createParser(axis: 'x' | 'z'): (obj: any) => MoredfsClampedGradient;
}
//# sourceMappingURL=lib.d.ts.map