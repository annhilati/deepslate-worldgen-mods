import { DensityFunction, Holder, Interval } from 'deepslate';
import FastNoiseLite from 'fastnoise-lite';
import type { InputParser } from '../types.js';
/** Ensures the custom Registry for FastNoiseConfig exists in Deepslate. */
export declare function ensureFastNoiseRegistry(): void;
export declare class LithostitchedSqrt extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedSqrt;
}
export declare class LithostitchedAxis extends DensityFunction {
    readonly axis: 'x' | 'y' | 'z';
    constructor(axis: 'x' | 'y' | 'z');
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any): LithostitchedAxis;
}
export declare class LithostitchedCeil extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedCeil;
}
export declare class LithostitchedFloor extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedFloor;
}
export declare class LithostitchedSin extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedSin;
}
export declare class LithostitchedCos extends DensityFunction {
    readonly input: DensityFunction;
    constructor(input: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedCos;
}
export declare class LithostitchedMix extends DensityFunction {
    readonly input: DensityFunction;
    readonly arg1: DensityFunction;
    readonly arg2: DensityFunction;
    constructor(input: DensityFunction, arg1: DensityFunction, arg2: DensityFunction);
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(obj: any, parser?: InputParser): LithostitchedMix;
}
export declare class LithostitchedSelect extends DensityFunction {
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
export declare class LithostitchedShift extends DensityFunction {
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
export declare class LithostitchedMarker extends DensityFunction {
    compute(_context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(): LithostitchedMarker;
}
export declare class LithostitchedFastNoise extends DensityFunction {
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