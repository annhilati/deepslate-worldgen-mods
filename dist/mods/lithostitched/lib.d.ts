import { DensityFunction, Holder } from 'deepslate';
import FastNoiseLite from 'fastnoise-lite';
import { Interval, CompatDensityFunction } from '../../compat/index.js';
import type { InputParser } from '../../types.js';
/** Ensures the custom Registry for FastNoiseConfig exists in Deepslate. */
export declare function ensureFastNoiseRegistry(): void;
export declare class LithostitchedSqrt extends CompatDensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedSqrt;
}
export declare class LithostitchedAxis extends CompatDensityFunction {
    readonly axis: 'x' | 'y' | 'z';
    constructor(axis: 'x' | 'y' | 'z');
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any): LithostitchedAxis;
}
export declare class LithostitchedCeil extends CompatDensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedCeil;
}
export declare class LithostitchedFloor extends CompatDensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedFloor;
}
export declare class LithostitchedSin extends CompatDensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedSin;
}
export declare class LithostitchedCos extends CompatDensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedCos;
}
export declare class LithostitchedMix extends CompatDensityFunction {
    readonly input: DensityFunction;
    readonly arg1: DensityFunction;
    readonly arg2: DensityFunction;
    constructor(input: DensityFunction, arg1: DensityFunction, arg2: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedMix;
}
export declare class LithostitchedSelect extends CompatDensityFunction {
    readonly input: DensityFunction;
    readonly fallback: DensityFunction;
    readonly selections: {
        range: [number, number];
        function: DensityFunction;
    }[];
    readonly min: number;
    readonly max: number;
    constructor(input: DensityFunction, fallback: DensityFunction, selections: {
        range: [number, number];
        function: DensityFunction;
    }[]);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedSelect;
}
export declare class LithostitchedShift extends CompatDensityFunction {
    readonly input: DensityFunction;
    readonly shiftX: DensityFunction;
    readonly shiftY: DensityFunction;
    readonly shiftZ: DensityFunction;
    constructor(input: DensityFunction, shiftX: DensityFunction, shiftY: DensityFunction, shiftZ: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedShift;
}
export declare class LithostitchedMarker extends CompatDensityFunction {
    compute(_context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(): LithostitchedMarker;
}
export declare class LithostitchedFastNoise extends CompatDensityFunction {
    readonly configHolder: Holder<any>;
    readonly xzScale: number;
    readonly yScale: number;
    readonly shiftX: DensityFunction;
    readonly shiftY: DensityFunction;
    readonly shiftZ: DensityFunction;
    readonly fnl: FastNoiseLite;
    private initializedConfig;
    constructor(configHolder: Holder<any>, xzScale: number, yScale: number, shiftX: DensityFunction, shiftY: DensityFunction, shiftZ: DensityFunction);
    applyConfig(configData: any): void;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedFastNoise;
}
//# sourceMappingURL=lib.d.ts.map