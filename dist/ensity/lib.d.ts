import { DensityFunction, Interval, SimplexNoise } from 'deepslate';
import type { InputParser } from '../types.js';
export declare class EnsityLonelyIsland extends DensityFunction {
    compute(context: DensityFunction.Context): number;
    private static readonly RANGE;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): EnsityLonelyIsland;
}
export declare class EnsityFloatingIslands extends DensityFunction {
    readonly islandNoise: SimplexNoise;
    constructor(seed?: bigint);
    getHeightValue(x: number, z: number): number;
    compute(context: DensityFunction.Context): number;
    private static readonly RANGE;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): EnsityFloatingIslands;
}
//# sourceMappingURL=lib.d.ts.map