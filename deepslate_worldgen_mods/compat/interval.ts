import * as deepslate from 'deepslate';

export class IntervalPolyfill {
    readonly min: number;
    readonly max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    static of(min: number, max: number): IntervalPolyfill {
        return new IntervalPolyfill(min, max);
    }

    static ofExact(value: number): IntervalPolyfill {
        return new IntervalPolyfill(value, value);
    }

    static ofSymmetric(range: number): IntervalPolyfill {
        return new IntervalPolyfill(-range, range);
    }

    static between(first: number, second: number): IntervalPolyfill {
        return new IntervalPolyfill(Math.min(first, second), Math.max(first, second));
    }

    static encapsulating(...intervals: IntervalPolyfill[]): IntervalPolyfill {
        if (intervals.length === 0) return IntervalPolyfill.NaI;
        let min = Infinity;
        let max = -Infinity;
        for (const i of intervals) {
            if (i.min < min) min = i.min;
            if (i.max > max) max = i.max;
        }
        return new IntervalPolyfill(min, max);
    }

    static clamp(input: IntervalPolyfill, min: number, max: number): IntervalPolyfill {
        return new IntervalPolyfill(
            Math.max(min, Math.min(max, input.min)),
            Math.max(min, Math.min(max, input.max))
        );
    }

    static reciprocal(input: IntervalPolyfill): IntervalPolyfill {
        if (input.min <= 0 && input.max >= 0) {
            return IntervalPolyfill.INFINITE;
        }
        return new IntervalPolyfill(1.0 / input.max, 1.0 / input.min);
    }

    static readonly INFINITE = new IntervalPolyfill(-Infinity, Infinity);
    static readonly NaI = new IntervalPolyfill(NaN, NaN);

    contains(value: number): boolean {
        return value >= this.min && value <= this.max;
    }

    intersects(other: IntervalPolyfill): boolean {
        return this.max >= other.min && this.min <= other.max;
    }

    isNaI(): boolean {
        return isNaN(this.min) || isNaN(this.max);
    }
}

export const Interval: typeof IntervalPolyfill = (deepslate as any).Interval ?? IntervalPolyfill;
export type Interval = IntervalPolyfill;
