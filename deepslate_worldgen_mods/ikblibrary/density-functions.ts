import { DensityFunction, Interval, Json } from 'deepslate';
import type { InputParser } from '../types.js';
import {
    CachedVoronoiNoise,
    type Vec3i,
    type VoronoiPlate,
    VoronoiNoise,
} from './noise.js';

//======// Seeded Density Function Interface & Visitor //===========================================//

export interface SeededDensityFunction extends DensityFunction {
    initialized(): boolean;
    initialize(levelSeed: bigint): DensityFunction;
}

export function isSeededDensityFunction(fn: unknown): fn is SeededDensityFunction {
    return (
        fn !== null &&
        typeof fn === 'object' &&
        'initialized' in fn &&
        typeof (fn as any).initialized === 'function' &&
        'initialize' in fn &&
        typeof (fn as any).initialize === 'function'
    );
}

export class SeededVisitor implements DensityFunction.Visitor {
    readonly levelSeed: bigint;

    constructor(levelSeed: bigint | number) {
        this.levelSeed = BigInt(levelSeed);
    }

    apply = (function_: DensityFunction): DensityFunction => {
        if (isSeededDensityFunction(function_)) {
            return function_.initialized() ? function_ : function_.initialize(this.levelSeed);
        }
        return function_;
    };
}

//======// Helper Utilities //====================================================================//

function parseSalt(val: unknown): bigint {
    if (typeof val === 'bigint') return val;
    if (typeof val === 'number') return BigInt(Math.trunc(val));
    if (typeof val === 'string') {
        try {
            return BigInt(val);
        } catch {
            return 0n;
        }
    }
    return 0n;
}

export function unwrapCachedVoronoi(function_: DensityFunction): CachedVoronoiDF {
    let current: any = function_;
    const visited = new Set<any>();

    while (current && !visited.has(current)) {
        visited.add(current);
        if (current instanceof CachedVoronoiDF) {
            return current;
        }
        if (current instanceof DensityFunction.HolderHolder && current.holder) {
            current = current.holder.value();
            continue;
        }
        if (typeof current.wrapped === 'function') {
            current = current.wrapped();
            continue;
        }
        if (current.wrapped instanceof DensityFunction) {
            current = current.wrapped;
            continue;
        }
        if (current.input instanceof DensityFunction) {
            current = current.input;
            continue;
        }
        break;
    }

    throw new Error(
        `Trying to pull from something other than a CachedVoronoi: ${
            current?.constructor?.name ?? typeof current
        }`
    );
}

//======// 1. VoronoiDF //========================================================================//

export class VoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly mode: number;
    readonly ordinal: number;

    noise?: VoronoiNoise;
    private _initialized = false;

    constructor(
        salt: bigint | number = 0n,
        flat: boolean = true,
        scale: number = 100,
        jitter: number = 0.4,
        metric: number = 1,
        mode: number = 0,
        ordinal: number = 1,
        noise?: VoronoiNoise
    ) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.mode = mode;
        this.ordinal = ordinal;
        this.noise = noise;
        if (noise) this._initialized = true;
    }

    getNoise(): VoronoiNoise {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }

    compute(context: DensityFunction.Context): number {
        const n = this.getNoise();
        return this.mode === 0 || this.mode === 6
            ? n.getDistance(context, this.flat, this.scale, this.jitter, this.metric, this.ordinal, this.mode === 6)
            : n.getVoronoi(context, this.flat, this.scale, this.jitter, this.metric, this.mode, this.ordinal);
    }

    range(): Interval {
        switch (this.mode) {
            case 0:
            case 6:
                return Interval.of(0, Infinity);
            case 1:
                return Interval.of(-1, 1);
            case 2:
                return Interval.INFINITE;
            case 3:
                return Interval.of(0, 1);
            case 4:
            case 5:
                return Interval.of(-Math.PI * 1.5, Math.PI * 0.5);
            default:
                return Interval.INFINITE;
        }
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    initialized(): boolean {
        return this._initialized;
    }

    initialize(levelSeed: bigint): this {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }

    static fromJson(obj: unknown, _parser?: InputParser): VoronoiDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new VoronoiDF(
            parseSalt(root.salt),
            Json.readBoolean(root.flat) ?? true,
            Json.readNumber(root.scale) ?? 100,
            Json.readNumber(root.jitter) ?? 0.4,
            Json.readInt(root.metric) ?? 1,
            Json.readInt(root.mode) ?? 0,
            Json.readInt(root.ordinal) ?? 1
        );
    }
}

//======// 2. CachedVoronoiDF //==================================================================//

export class CachedVoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly maxCheck: number;

    noise?: CachedVoronoiNoise;
    private _initialized = false;

    constructor(
        salt: bigint | number = 0n,
        flat: boolean = true,
        scale: number = 100,
        jitter: number = 0.4,
        metric: number = 1,
        maxCheck: number = 3,
        noise?: CachedVoronoiNoise
    ) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.maxCheck = maxCheck;
        this.noise = noise;
        if (noise) this._initialized = true;
    }

    getNoise(): CachedVoronoiNoise {
        if (!this.noise) {
            this.noise = CachedVoronoiNoise.create(this.salt);
        }
        return this.noise;
    }

    compute(_context: DensityFunction.Context): number {
        return 0;
    }

    range(): Interval {
        return Interval.ofExact(0);
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    initialized(): boolean {
        return this._initialized;
    }

    initialize(levelSeed: bigint): this {
        this.noise = CachedVoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }

    getNearest(blockPos: DensityFunction.Context, index: number): VoronoiPlate {
        const plates = this.getNoise().getNearest(
            blockPos,
            this.flat,
            this.scale,
            this.jitter,
            this.metric,
            this.maxCheck
        );
        return plates[index] ?? plates[0];
    }

    getSamples(pos: DensityFunction.Context, ordinal: number, sampler: DensityFunction): number[] {
        return [this.getNoise().sample(pos, this.flat, this.scale, this.jitter, this.metric, ordinal, sampler)];
    }

    getWatersheds(
        index: Vec3i,
        sampler: DensityFunction
    ): { plates: VoronoiPlate[]; gradients: number[] } {
        return this.getNoise().getWatersheds(
            index,
            this.jitter,
            sampler,
            this.scale,
            this.flat,
            this.metric
        );
    }

    getDistance(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getDistances(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getValue(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getValues(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getVelocity(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getVelocities(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getPassive(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getPassives(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getDirection(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getRelDirection(pos: DensityFunction.Context, index: number): number {
        return this.maxCheck > index
            ? this.getNoise().getRelDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }

    getDistances(pos: DensityFunction.Context): number[] {
        return this.getNoise().getDistances(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    getVelocities(pos: DensityFunction.Context): number[] {
        return this.getNoise().getVelocities(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    getValues(pos: DensityFunction.Context): number[] {
        return this.getNoise().getValues(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    getPassives(pos: DensityFunction.Context): number[] {
        return this.getNoise().getPassives(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    getDirections(pos: DensityFunction.Context): number[] {
        return this.getNoise().getDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    getRelDirections(pos: DensityFunction.Context): number[] {
        return this.getNoise().getRelDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }

    static fromJson(obj: unknown, _parser?: InputParser): CachedVoronoiDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new CachedVoronoiDF(
            parseSalt(root.salt),
            Json.readBoolean(root.flat) ?? true,
            Json.readNumber(root.scale) ?? 100,
            Json.readNumber(root.jitter) ?? 0.4,
            Json.readInt(root.metric) ?? 1,
            Json.readInt(root.maxCheck ?? (root as any).max_check) ?? 3
        );
    }
}

//======// 3. PullFromCachedVoronoiDF //===========================================================//

export class PullFromCachedVoronoiDF extends DensityFunction implements SeededDensityFunction {
    readonly mode: number;
    readonly ordinal: number;
    readonly cache: DensityFunction;

    private _cachedVoronoi?: CachedVoronoiDF;

    constructor(mode: number = 0, ordinal: number = 1, cache: DensityFunction) {
        super();
        this.mode = mode;
        this.ordinal = ordinal;
        this.cache = cache;
    }

    get cachedVoronoi(): CachedVoronoiDF {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }

    compute(context: DensityFunction.Context): number {
        const cv = this.cachedVoronoi;
        const idx = this.ordinal - 1;
        switch (this.mode) {
            default:
            case 0:
                return cv.getDistance(context, idx);
            case 1:
                return cv.getValue(context, idx);
            case 2:
                return cv.getVelocity(context, idx);
            case 3:
                return cv.getPassive(context, idx);
            case 4:
                return cv.getDirection(context, idx);
            case 5:
                return cv.getRelDirection(context, idx);
        }
    }

    range(): Interval {
        switch (this.mode) {
            case 0:
                return Interval.of(0, Infinity);
            case 1:
                return Interval.of(-1, 1);
            case 2:
                return Interval.INFINITE;
            case 3:
                return Interval.of(0, 1);
            case 4:
            case 5:
                return Interval.of(-Math.PI * 1.5, Math.PI * 0.5);
            default:
                return Interval.INFINITE;
        }
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new PullFromCachedVoronoiDF(this.mode, this.ordinal, visitor.apply(this.cache));
    }

    initialized(): boolean {
        return this.cachedVoronoi.initialized();
    }

    initialize(levelSeed: bigint): this {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): PullFromCachedVoronoiDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new PullFromCachedVoronoiDF(
            Json.readInt(root.mode) ?? 0,
            Json.readInt(root.ordinal) ?? 1,
            parser(root.cache ?? (root as any).cached_voronoi)
        );
    }
}

//======// 4. VoronoiDistanceDF //================================================================//

export class VoronoiDistanceDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly rel: boolean;
    readonly ordinal: number;

    noise?: VoronoiNoise;
    private _initialized = false;

    constructor(
        salt: bigint | number = 0n,
        flat: boolean = true,
        scale: number = 100,
        jitter: number = 0.4,
        metric: number = 1,
        rel: boolean = false,
        ordinal: number = 1,
        noise?: VoronoiNoise
    ) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.rel = rel;
        this.ordinal = ordinal;
        this.noise = noise;
        if (noise) this._initialized = true;
    }

    getNoise(): VoronoiNoise {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }

    compute(context: DensityFunction.Context): number {
        return this.getNoise().getDistance(
            context,
            this.flat,
            this.scale,
            this.jitter,
            this.metric,
            this.ordinal,
            this.rel
        );
    }

    range(): Interval {
        return Interval.of(0, Infinity);
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    initialized(): boolean {
        return this._initialized;
    }

    initialize(levelSeed: bigint): this {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }

    static fromJson(obj: unknown, _parser?: InputParser): VoronoiDistanceDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new VoronoiDistanceDF(
            parseSalt(root.salt),
            Json.readBoolean(root.flat) ?? true,
            Json.readNumber(root.scale) ?? 100,
            Json.readNumber(root.jitter) ?? 0.4,
            Json.readInt(root.metric) ?? 1,
            Json.readBoolean(root.rel) ?? false,
            Json.readInt(root.ordinal) ?? 1
        );
    }
}

//======// 5. VoronoiCenterDF //==================================================================//

export class VoronoiCenterDF extends DensityFunction implements SeededDensityFunction {
    readonly salt: bigint;
    readonly flat: boolean;
    readonly scale: number;
    readonly jitter: number;
    readonly metric: number;
    readonly ordinal: number;
    readonly sampler: DensityFunction;

    noise?: VoronoiNoise;
    private _initialized = false;

    constructor(
        salt: bigint | number = 0n,
        flat: boolean = true,
        scale: number = 100,
        jitter: number = 0.4,
        metric: number = 1,
        ordinal: number = 1,
        sampler: DensityFunction = DensityFunction.Constant.ZERO,
        noise?: VoronoiNoise
    ) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.ordinal = ordinal;
        this.sampler = sampler;
        this.noise = noise;
        if (noise) this._initialized = true;
    }

    getNoise(): VoronoiNoise {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }

    compute(context: DensityFunction.Context): number {
        const plate = this.getNoise().getPlateAtPos(
            context,
            this.flat,
            this.scale,
            this.jitter,
            this.metric,
            this.ordinal
        );
        const centerPos = plate.getCenterPos(this.scale, this.flat);
        return this.sampler.compute(centerPos);
    }

    range(): Interval {
        return this.sampler.range();
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new VoronoiCenterDF(
            this.salt,
            this.flat,
            this.scale,
            this.jitter,
            this.metric,
            this.ordinal,
            visitor.apply(this.sampler),
            this.noise
        );
    }

    initialized(): boolean {
        return this._initialized;
    }

    initialize(levelSeed: bigint): this {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): VoronoiCenterDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new VoronoiCenterDF(
            parseSalt(root.salt),
            Json.readBoolean(root.flat) ?? true,
            Json.readNumber(root.scale) ?? 100,
            Json.readNumber(root.jitter) ?? 0.4,
            Json.readInt(root.metric) ?? 1,
            Json.readInt(root.ordinal) ?? 1,
            parser(root.sampler)
        );
    }
}

//======// 6. PullCachedCenterDF //===============================================================//

export class PullCachedCenterDF extends DensityFunction implements SeededDensityFunction {
    readonly ordinal: number;
    readonly cache: DensityFunction;
    readonly sampler: DensityFunction;

    private readonly memoSamples: Map<string, number> = new Map();
    private _cachedVoronoi?: CachedVoronoiDF;

    constructor(
        ordinal: number = 1,
        cache: DensityFunction,
        sampler: DensityFunction = DensityFunction.Constant.ZERO
    ) {
        super();
        this.ordinal = ordinal;
        this.cache = cache;
        this.sampler = sampler;
    }

    get cachedVoronoi(): CachedVoronoiDF {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }

    compute(context: DensityFunction.Context): number {
        const plate = this.cachedVoronoi.getNearest(context, this.ordinal - 1);
        const idxKey = `${plate.index.x},${plate.index.y},${plate.index.z}`;
        const cached = this.memoSamples.get(idxKey);
        if (cached !== undefined) {
            return cached;
        }

        const samples = this.cachedVoronoi.getSamples(context, this.ordinal, this.sampler);
        const val = samples[0] ?? 0;
        this.memoSamples.set(idxKey, val);
        return val;
    }

    range(): Interval {
        return this.sampler.range();
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new PullCachedCenterDF(
            this.ordinal,
            visitor.apply(this.cache),
            visitor.apply(this.sampler)
        );
    }

    initialized(): boolean {
        return this.cachedVoronoi.initialized();
    }

    initialize(levelSeed: bigint): this {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): PullCachedCenterDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new PullCachedCenterDF(
            Json.readInt(root.ordinal) ?? 1,
            parser(root.cache ?? (root as any).cached_voronoi),
            parser(root.sampler)
        );
    }
}

//======// 7. NearestSeaDF //=====================================================================//

export class NearestSeaDF extends DensityFunction implements SeededDensityFunction {
    readonly cache: DensityFunction;
    readonly peak: number;
    readonly contBias: number;
    readonly distanceMode: boolean;

    private _cachedVoronoi?: CachedVoronoiDF;

    constructor(
        cache: DensityFunction,
        peak: number = 0.25,
        contBias: number = 0.5,
        distanceMode: boolean = true
    ) {
        super();
        this.cache = cache;
        this.peak = peak;
        this.contBias = contBias;
        this.distanceMode = distanceMode;
    }

    get cachedVoronoi(): CachedVoronoiDF {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }

    compute(context: DensityFunction.Context): number {
        const cv = this.cachedVoronoi;
        const val = cv.getValues(context);
        const vel = cv.getVelocities(context);
        const dist = cv.getDistances(context);

        if (this.distanceMode) {
            return NearestSeaDF.distToSea(val, vel, dist, this.peak, this.contBias);
        }
        const dir = cv.getRelDirections(context);
        return NearestSeaDF.dirOfSea(val, vel, dist, dir, this.peak, this.contBias);
    }

    private static distToSea(
        val: number[],
        vel: number[],
        dist: number[],
        peak: number,
        contBias: number
    ): number {
        if (val[0] >= contBias) {
            const len = Math.min(9, val.length);
            for (let j = 1; j < len; j++) {
                if (val[j] < contBias) {
                    if (vel[j] > 0 && dist[j] - dist[0] < peak) return dist[j] - dist[0];
                    if (vel[j] <= 0) return dist[j] - dist[0];
                }
            }
            return 10;
        }
        return 0;
    }

    private static dirOfSea(
        val: number[],
        vel: number[],
        dist: number[],
        dir: number[],
        peak: number,
        contBias: number
    ): number {
        if (val[0] >= contBias) {
            const len = Math.min(9, val.length);
            for (let j = 1; j < len; j++) {
                if (val[j] < contBias) {
                    if (vel[j] > 0 && dist[j] - dist[0] < peak) return dir[j];
                    if (vel[j] <= 0) return dir[j];
                }
            }
            return 10;
        }
        return 0;
    }

    range(): Interval {
        return this.distanceMode ? Interval.of(0, 10) : Interval.of(-Math.PI * 1.5, 10);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new NearestSeaDF(
            visitor.apply(this.cache),
            this.peak,
            this.contBias,
            this.distanceMode
        );
    }

    initialized(): boolean {
        return this.cachedVoronoi.initialized();
    }

    initialize(levelSeed: bigint): this {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): NearestSeaDF {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new NearestSeaDF(
            parser(root.cache ?? (root as any).cached_voronoi),
            Json.readNumber(root.peak) ?? 0.25,
            Json.readNumber(root.cont_bias ?? (root as any).contBias) ?? 0.5,
            Json.readBoolean(root.distance) ?? true
        );
    }
}
