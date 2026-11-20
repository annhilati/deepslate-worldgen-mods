import { DensityFunction } from 'deepslate';
import { Interval } from './interval.js';
export declare abstract class CompatDensityFunction extends DensityFunction {
    abstract compute(context: DensityFunction.Context): number;
    abstract mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    abstract range(): Interval;
    minValue(): number;
    maxValue(): number;
    mapAll(visitor: any): DensityFunction;
}
//# sourceMappingURL=density-function.d.ts.map