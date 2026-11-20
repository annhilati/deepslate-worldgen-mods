export declare class IntervalPolyfill {
    readonly min: number;
    readonly max: number;
    constructor(min: number, max: number);
    static of(min: number, max: number): IntervalPolyfill;
    static ofExact(value: number): IntervalPolyfill;
    static ofSymmetric(range: number): IntervalPolyfill;
    static between(first: number, second: number): IntervalPolyfill;
    static encapsulating(...intervals: IntervalPolyfill[]): IntervalPolyfill;
    static clamp(input: IntervalPolyfill, min: number, max: number): IntervalPolyfill;
    static reciprocal(input: IntervalPolyfill): IntervalPolyfill;
    static readonly INFINITE: IntervalPolyfill;
    static readonly NaI: IntervalPolyfill;
    contains(value: number): boolean;
    intersects(other: IntervalPolyfill): boolean;
    isNaI(): boolean;
}
export declare const Interval: typeof IntervalPolyfill;
export type Interval = IntervalPolyfill;
//# sourceMappingURL=interval.d.ts.map