import { DensityFunction, SimplexNoise } from 'deepslate';
import { Interval, CompatDensityFunction } from '../../compat/index.js';
import type { InputParser } from '../../types.js';
export declare class EnsityLonelyIsland extends CompatDensityFunction {
    compute(context: DensityFunction.Context): number;
    private static readonly RANGE;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    static fromJson(_obj?: unknown, _parser?: InputParser): EnsityLonelyIsland;
}
export declare class EnsityFloatingIslands extends CompatDensityFunction {
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