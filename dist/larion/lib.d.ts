import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';
export declare class LarionDivision extends DensityFunction {
    readonly argument1: DensityFunction;
    readonly argument2: DensityFunction;
    constructor(argument1: DensityFunction, argument2: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionDivision;
}
export declare class LarionFlatDomainWarp extends DensityFunction {
    readonly input: DensityFunction;
    readonly warpX: DensityFunction;
    readonly warpZ: DensityFunction;
    constructor(input: DensityFunction, warpX: DensityFunction, warpZ: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionFlatDomainWarp;
}
export declare class LarionSignum extends DensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSignum;
}
export declare class LarionSine extends DensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSine;
}
export declare class LarionSqrt extends DensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSqrt;
}
export declare class LarionXCoord extends DensityFunction {
    private static readonly RANGE;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): LarionXCoord;
}
export declare class LarionZCoord extends DensityFunction {
    private static readonly RANGE;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): LarionZCoord;
}
//# sourceMappingURL=lib.d.ts.map