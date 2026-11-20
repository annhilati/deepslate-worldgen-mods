import { DensityFunction } from 'deepslate';
import { Interval, CompatDensityFunction } from '../../compat/index.js';
import type { InputParser } from '../../types.js';
export declare class LarionDivision extends CompatDensityFunction {
    readonly argument1: DensityFunction;
    readonly argument2: DensityFunction;
    constructor(argument1: DensityFunction, argument2: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionDivision;
}
export declare class LarionFlatDomainWarp extends CompatDensityFunction {
    readonly input: DensityFunction;
    readonly warpX: DensityFunction;
    readonly warpZ: DensityFunction;
    constructor(input: DensityFunction, warpX: DensityFunction, warpZ: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionFlatDomainWarp;
}
export declare class LarionSignum extends CompatDensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSignum;
}
export declare class LarionSine extends CompatDensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSine;
}
export declare class LarionSqrt extends CompatDensityFunction {
    readonly argument: DensityFunction;
    constructor(argument: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: unknown, parser?: InputParser): LarionSqrt;
}
export declare class LarionXCoord extends CompatDensityFunction {
    private static readonly RANGE;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): LarionXCoord;
}
export declare class LarionZCoord extends CompatDensityFunction {
    private static readonly RANGE;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): LarionZCoord;
}
//# sourceMappingURL=lib.d.ts.map