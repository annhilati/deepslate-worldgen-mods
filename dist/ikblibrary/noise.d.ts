import type { DensityFunction } from 'deepslate';
export interface Vec3i {
    x: number;
    y: number;
    z: number;
}
export interface Vec3d {
    x: number;
    y: number;
    z: number;
}
/** Precomputed random vectors table for jitter displacement from ikbLib. */
export declare const RAND_VECS: Float32Array;
export declare class VoronoiPlate {
    readonly hash: number;
    readonly index: Vec3i;
    readonly center: Vec3d;
    readonly value: number;
    constructor(seed: bigint, index: Vec3i, jitter: number);
    getCenterPos(scale: number, flat?: boolean): DensityFunction.Context;
    velocity(): Vec3i;
    relativeVelocity(otherPlate: VoronoiPlate): number;
    getDist(point: Vec3d, flat: boolean, metric: number): number;
}
export declare function velocityEquals(v0: Vec3i, v1: Vec3i): boolean;
export declare class VoronoiNoise {
    readonly seed: bigint;
    private readonly memoPlates;
    constructor(seed: bigint | number);
    static create(seed: bigint | number): VoronoiNoise;
    getPlate(index: Vec3i, jitter: number): VoronoiPlate;
    calcNearest(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, ordinal: number): {
        sortPlates: VoronoiPlate[];
        sortDistances: Float64Array;
    };
    calcDistances(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, ordinal: number): Float64Array;
    getPlateAtPos(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, ordinal: number): VoronoiPlate;
    getVoronoi(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, mode: number, ordinal: number): number;
    getDistance(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, ordinal: number, rel: boolean): number;
}
export declare class CachedVoronoiNoise {
    readonly seed: bigint;
    private readonly memoPlates;
    private readonly memoDists;
    private readonly memoValues;
    private readonly memoVelocities;
    private readonly memoPassives;
    private readonly memoDirections;
    private readonly memoRelDirections;
    private readonly memoNearest;
    private readonly memoCenters;
    constructor(seed: bigint | number);
    static create(seed: bigint | number): CachedVoronoiNoise;
    private posKey;
    getPlate(index: Vec3i, jitter: number): VoronoiPlate;
    getDistances(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getValues(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getVelocities(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getPassives(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getDirections(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getRelDirections(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): number[];
    getNearest(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): VoronoiPlate[];
    private calcNearest;
    private getVoronoi;
    sample(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, ordinal: number, sampler: DensityFunction): number;
    computeCenters(blockPos: DensityFunction.Context, flat: boolean, scale: number, jitter: number, metric: number, maxCheck: number): DensityFunction.Context[];
    static getDefaultWatersheds(): {
        plates: VoronoiPlate[];
        gradients: number[];
    };
    getWatersheds(index: Vec3i, jitter: number, sampler: DensityFunction, scale: number, flat: boolean, metric: number): {
        plates: VoronoiPlate[];
        gradients: number[];
    };
}
//# sourceMappingURL=noise.d.ts.map