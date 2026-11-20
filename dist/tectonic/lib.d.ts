import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';
export * from './config.js';
export declare class TectonicConfigClamp extends DensityFunction {
    readonly input: DensityFunction;
    readonly min: DensityFunction;
    readonly max: DensityFunction;
    constructor(input: DensityFunction, min: DensityFunction, max: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): TectonicConfigClamp;
}
export declare class TectonicInvert extends DensityFunction {
    readonly input: DensityFunction;
    readonly minVal: number;
    readonly maxVal: number;
    constructor(input: DensityFunction, minVal: number, maxVal: number);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): TectonicInvert;
}
export declare class TectonicConfigConstant extends DensityFunction {
    readonly key: string;
    readonly value: number;
    constructor(key: string, value?: number);
    compute(_context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, _parser?: InputParser): TectonicConfigConstant;
}
export declare class TectonicConfigNoise extends DensityFunction {
    readonly key: string;
    readonly noise: any;
    readonly shiftX: DensityFunction;
    readonly shiftZ: DensityFunction;
    readonly scale: number;
    readonly multiplier: number;
    readonly offset: number;
    readonly smootherScaling: boolean;
    readonly noiseSampler?: any;
    constructor(key: string, noise: any, shiftX: DensityFunction, shiftZ: DensityFunction, scale: number, multiplier?: number, offset?: number, smootherScaling?: boolean, noiseSampler?: any);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    withNewNoise(noiseSampler: any): TectonicConfigNoise;
    static fromJson(obj: unknown, parser?: InputParser): TectonicConfigNoise;
}
//# sourceMappingURL=lib.d.ts.map