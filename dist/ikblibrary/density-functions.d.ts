import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';
import { CachedVoronoiNoise, type Vec3i, type VoronoiPlate, VoronoiNoise } from './noise.js';
export interface SeededDensityFunction extends DensityFunction {
    initialized(): boolean;
    initialize(levelSeed: bigint): DensityFunction;
}
export declare function isSeededDensityFunction(fn: unknown): fn is SeededDensityFunction;
export declare class SeededVisitor implements DensityFunction.Visitor {
    readonly levelSeed: bigint;
    constructor(levelSeed: bigint | number);
    apply: (function_: DensityFunction) => DensityFunction;
}
export declare function unwrapCachedVoronoi(function_: DensityFunction): CachedVoronoiDF;
export declare class VoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly mode: number;
    readonly ordinal: number;
    noise?: VoronoiNoise;
    private _initialized;
    constructor(salt?: bigint | number, flat?: boolean, scale?: number, jitter?: number, metric?: number, mode?: number, ordinal?: number, noise?: VoronoiNoise);
    getNoise(): VoronoiNoise;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, _parser?: InputParser): VoronoiDF;
}
export declare class CachedVoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly maxCheck: number;
    noise?: CachedVoronoiNoise;
    private _initialized;
    constructor(salt?: bigint | number, flat?: boolean, scale?: number, jitter?: number, metric?: number, maxCheck?: number, noise?: CachedVoronoiNoise);
    getNoise(): CachedVoronoiNoise;
    compute(_context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    getNearest(blockPos: DensityFunction.Context, index: number): VoronoiPlate;
    getSamples(pos: DensityFunction.Context, ordinal: number, sampler: DensityFunction): number[];
    getWatersheds(index: Vec3i, sampler: DensityFunction): {
        plates: VoronoiPlate[];
        gradients: number[];
    };
    getDistance(pos: DensityFunction.Context, index: number): number;
    getValue(pos: DensityFunction.Context, index: number): number;
    getVelocity(pos: DensityFunction.Context, index: number): number;
    getPassive(pos: DensityFunction.Context, index: number): number;
    getDirection(pos: DensityFunction.Context, index: number): number;
    getRelDirection(pos: DensityFunction.Context, index: number): number;
    getDistances(pos: DensityFunction.Context): number[];
    getVelocities(pos: DensityFunction.Context): number[];
    getValues(pos: DensityFunction.Context): number[];
    getPassives(pos: DensityFunction.Context): number[];
    getDirections(pos: DensityFunction.Context): number[];
    getRelDirections(pos: DensityFunction.Context): number[];
    static fromJson(obj: unknown, _parser?: InputParser): CachedVoronoiDF;
}
export declare class PullFromCachedVoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly mode: number;
    readonly ordinal: number;
    readonly cache: DensityFunction;
    private _cachedVoronoi?;
    constructor(mode: number | undefined, ordinal: number | undefined, cache: DensityFunction);
    get cachedVoronoi(): CachedVoronoiDF;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, parser?: InputParser): PullFromCachedVoronoiDF;
}
export declare class VoronoiDistanceDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly rel: boolean;
    readonly ordinal: number;
    noise?: VoronoiNoise;
    private _initialized;
    constructor(salt?: bigint | number, flat?: boolean, scale?: number, jitter?: number, metric?: number, rel?: boolean, ordinal?: number, noise?: VoronoiNoise);
    getNoise(): VoronoiNoise;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, _parser?: InputParser): VoronoiDistanceDF;
}
export declare class VoronoiCenterDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly ordinal: number;
    readonly sampler: DensityFunction;
    noise?: VoronoiNoise;
    private _initialized;
    constructor(salt?: bigint | number, flat?: boolean, scale?: number, jitter?: number, metric?: number, ordinal?: number, sampler?: DensityFunction, noise?: VoronoiNoise);
    getNoise(): VoronoiNoise;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, parser?: InputParser): VoronoiCenterDF;
}
export declare class PullCachedCenterDF extends DensityFunction implements SeededDensityFunction {
    readonly ordinal: number;
    readonly cache: DensityFunction;
    readonly sampler: DensityFunction;
    private readonly memoSamples;
    private _cachedVoronoi?;
    constructor(ordinal: number | undefined, cache: DensityFunction, sampler?: DensityFunction);
    get cachedVoronoi(): CachedVoronoiDF;
    compute(context: DensityFunction.Context): number;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, parser?: InputParser): PullCachedCenterDF;
}
export declare class NearestSeaDF extends DensityFunction implements SeededDensityFunction {
    readonly cache: DensityFunction;
    readonly peak: number;
    readonly contBias: number;
    readonly distanceMode: boolean;
    private _cachedVoronoi?;
    constructor(cache: DensityFunction, peak?: number, contBias?: number, distanceMode?: boolean);
    get cachedVoronoi(): CachedVoronoiDF;
    compute(context: DensityFunction.Context): number;
    private static distToSea;
    private static dirOfSea;
    range(): Interval;
    mapChildren(visitor: DensityFunction.Visitor): DensityFunction;
    initialized(): boolean;
    initialize(levelSeed: bigint): this;
    static fromJson(obj: unknown, parser?: InputParser): NearestSeaDF;
}
//# sourceMappingURL=density-functions.d.ts.map