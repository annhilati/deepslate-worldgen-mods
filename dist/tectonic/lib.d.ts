import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';
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
//# sourceMappingURL=lib.d.ts.map