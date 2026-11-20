import { DensityFunction } from 'deepslate';
import { Interval } from './interval.js';

export abstract class CompatDensityFunction extends DensityFunction {
    abstract override compute(context: DensityFunction.Context): number;
    abstract override mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    abstract override range(): Interval;

    public minValue(): number {
        return this.range().min;
    }

    public maxValue(): number {
        return this.range().max;
    }

    public override mapAll(visitor: any): DensityFunction {
        // 0.26+ / 0.27+: When super.mapAll exists and visitor.apply is provided
        if (typeof super.mapAll === 'function' && typeof visitor?.apply === 'function') {
            return super.mapAll(visitor);
        }

        // Adapter visitor that satisfies both 0.27+ (.apply) and 0.23.6 (.map) contracts
        const dualVisitor = {
            apply: (fn: DensityFunction) => typeof visitor?.apply === 'function' ? visitor.apply(fn) : visitor.map(fn),
            map: (fn: DensityFunction) => typeof visitor?.map === 'function' ? visitor.map(fn) : visitor.apply(fn),
        };

        // 0.23.6 compatibility:
        // Deepslate 0.23.6 expects mapAll(visitor) with visitor.map(child)
        const visitor023 = {
            apply: (child: DensityFunction): DensityFunction => {
                if (child === null || child === undefined) {
                    return child;
                }
                if (typeof (child as any).mapAll === 'function') {
                    return (child as any).mapAll(dualVisitor);
                }
                if (typeof (child as any).mapChildren === 'function') {
                    return typeof visitor?.map === 'function'
                        ? visitor.map((child as any).mapChildren(visitor023))
                        : (child as any).mapChildren(visitor023);
                }
                return typeof visitor?.map === 'function' ? visitor.map(child) : child;
            }
        };

        const mappedChildren = this.mapChildren(visitor023 as any);
        return typeof visitor?.map === 'function' ? visitor.map(mappedChildren) : mappedChildren;
    }
}
