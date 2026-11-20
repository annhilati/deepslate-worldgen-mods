import * as deepslate from 'deepslate';
export class IntervalPolyfill {
    min;
    max;
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    static of(min, max) {
        return new IntervalPolyfill(min, max);
    }
    static ofExact(value) {
        return new IntervalPolyfill(value, value);
    }
    static ofSymmetric(range) {
        return new IntervalPolyfill(-range, range);
    }
    static between(first, second) {
        return new IntervalPolyfill(Math.min(first, second), Math.max(first, second));
    }
    static encapsulating(...intervals) {
        if (intervals.length === 0)
            return IntervalPolyfill.NaI;
        let min = Infinity;
        let max = -Infinity;
        for (const i of intervals) {
            if (i.min < min)
                min = i.min;
            if (i.max > max)
                max = i.max;
        }
        return new IntervalPolyfill(min, max);
    }
    static clamp(input, min, max) {
        return new IntervalPolyfill(Math.max(min, Math.min(max, input.min)), Math.max(min, Math.min(max, input.max)));
    }
    static reciprocal(input) {
        if (input.min <= 0 && input.max >= 0) {
            return IntervalPolyfill.INFINITE;
        }
        return new IntervalPolyfill(1.0 / input.max, 1.0 / input.min);
    }
    static INFINITE = new IntervalPolyfill(-Infinity, Infinity);
    static NaI = new IntervalPolyfill(NaN, NaN);
    contains(value) {
        return value >= this.min && value <= this.max;
    }
    intersects(other) {
        return this.max >= other.min && this.min <= other.max;
    }
    isNaI() {
        return isNaN(this.min) || isNaN(this.max);
    }
}
export const Interval = deepslate.Interval ?? IntervalPolyfill;
//# sourceMappingURL=interval.js.map