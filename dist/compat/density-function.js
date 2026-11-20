import { DensityFunction } from 'deepslate';
export class CompatDensityFunction extends DensityFunction {
    minValue() {
        return this.range().min;
    }
    maxValue() {
        return this.range().max;
    }
    mapAll(visitor) {
        // 0.26+ / 0.27+: When super.mapAll exists and visitor.apply is provided
        if (typeof super.mapAll === 'function' && typeof visitor?.apply === 'function') {
            return super.mapAll(visitor);
        }
        // Adapter visitor that satisfies both 0.27+ (.apply) and 0.23.6 (.map) contracts
        const dualVisitor = {
            apply: (fn) => typeof visitor?.apply === 'function' ? visitor.apply(fn) : visitor.map(fn),
            map: (fn) => typeof visitor?.map === 'function' ? visitor.map(fn) : visitor.apply(fn),
        };
        // 0.23.6 compatibility:
        // Deepslate 0.23.6 expects mapAll(visitor) with visitor.map(child)
        const visitor023 = {
            apply: (child) => {
                if (child === null || child === undefined) {
                    return child;
                }
                if (typeof child.mapAll === 'function') {
                    return child.mapAll(dualVisitor);
                }
                if (typeof child.mapChildren === 'function') {
                    return typeof visitor?.map === 'function'
                        ? visitor.map(child.mapChildren(visitor023))
                        : child.mapChildren(visitor023);
                }
                return typeof visitor?.map === 'function' ? visitor.map(child) : child;
            }
        };
        const mappedChildren = this.mapChildren(visitor023);
        return typeof visitor?.map === 'function' ? visitor.map(mappedChildren) : mappedChildren;
    }
}
//# sourceMappingURL=density-function.js.map