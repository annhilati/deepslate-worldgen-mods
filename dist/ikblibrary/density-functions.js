import { DensityFunction, Interval, Json } from 'deepslate';
import { CachedVoronoiNoise, VoronoiNoise, } from './noise.js';
export function isSeededDensityFunction(fn) {
    return (fn !== null &&
        typeof fn === 'object' &&
        'initialized' in fn &&
        typeof fn.initialized === 'function' &&
        'initialize' in fn &&
        typeof fn.initialize === 'function');
}
export class SeededVisitor {
    levelSeed;
    constructor(levelSeed) {
        this.levelSeed = BigInt(levelSeed);
    }
    apply = (function_) => {
        if (isSeededDensityFunction(function_)) {
            return function_.initialized() ? function_ : function_.initialize(this.levelSeed);
        }
        return function_;
    };
}
//======// Helper Utilities //====================================================================//
function parseSalt(val) {
    if (typeof val === 'bigint')
        return val;
    if (typeof val === 'number')
        return BigInt(Math.trunc(val));
    if (typeof val === 'string') {
        try {
            return BigInt(val);
        }
        catch {
            return 0n;
        }
    }
    return 0n;
}
export function unwrapCachedVoronoi(function_) {
    let current = function_;
    const visited = new Set();
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
    throw new Error(`Trying to pull from something other than a CachedVoronoi: ${current?.constructor?.name ?? typeof current}`);
}
//======// 1. VoronoiDF //========================================================================//
export class VoronoiDF extends DensityFunction {
    salt;
    flat;
    scale;
    jitter;
    metric;
    mode;
    ordinal;
    noise;
    _initialized = false;
    constructor(salt = 0n, flat = true, scale = 100, jitter = 0.4, metric = 1, mode = 0, ordinal = 1, noise) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.mode = mode;
        this.ordinal = ordinal;
        this.noise = noise;
        if (noise)
            this._initialized = true;
    }
    getNoise() {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }
    compute(context) {
        const n = this.getNoise();
        return this.mode === 0 || this.mode === 6
            ? n.getDistance(context, this.flat, this.scale, this.jitter, this.metric, this.ordinal, this.mode === 6)
            : n.getVoronoi(context, this.flat, this.scale, this.jitter, this.metric, this.mode, this.ordinal);
    }
    range() {
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
    mapChildren(_visitor) {
        return this;
    }
    initialized() {
        return this._initialized;
    }
    initialize(levelSeed) {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }
    static fromJson(obj, _parser) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new VoronoiDF(parseSalt(root.salt), Json.readBoolean(root.flat) ?? true, Json.readNumber(root.scale) ?? 100, Json.readNumber(root.jitter) ?? 0.4, Json.readInt(root.metric) ?? 1, Json.readInt(root.mode) ?? 0, Json.readInt(root.ordinal) ?? 1);
    }
}
//======// 2. CachedVoronoiDF //==================================================================//
export class CachedVoronoiDF extends DensityFunction {
    salt;
    flat;
    scale;
    jitter;
    metric;
    maxCheck;
    noise;
    _initialized = false;
    constructor(salt = 0n, flat = true, scale = 100, jitter = 0.4, metric = 1, maxCheck = 3, noise) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.maxCheck = maxCheck;
        this.noise = noise;
        if (noise)
            this._initialized = true;
    }
    getNoise() {
        if (!this.noise) {
            this.noise = CachedVoronoiNoise.create(this.salt);
        }
        return this.noise;
    }
    compute(_context) {
        return 0;
    }
    range() {
        return Interval.ofExact(0);
    }
    mapChildren(_visitor) {
        return this;
    }
    initialized() {
        return this._initialized;
    }
    initialize(levelSeed) {
        this.noise = CachedVoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }
    getNearest(blockPos, index) {
        const plates = this.getNoise().getNearest(blockPos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
        return plates[index] ?? plates[0];
    }
    getSamples(pos, ordinal, sampler) {
        return [this.getNoise().sample(pos, this.flat, this.scale, this.jitter, this.metric, ordinal, sampler)];
    }
    getWatersheds(index, sampler) {
        return this.getNoise().getWatersheds(index, this.jitter, sampler, this.scale, this.flat, this.metric);
    }
    getDistance(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getDistances(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getValue(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getValues(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getVelocity(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getVelocities(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getPassive(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getPassives(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getDirection(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getRelDirection(pos, index) {
        return this.maxCheck > index
            ? this.getNoise().getRelDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck)[index]
            : 0;
    }
    getDistances(pos) {
        return this.getNoise().getDistances(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    getVelocities(pos) {
        return this.getNoise().getVelocities(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    getValues(pos) {
        return this.getNoise().getValues(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    getPassives(pos) {
        return this.getNoise().getPassives(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    getDirections(pos) {
        return this.getNoise().getDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    getRelDirections(pos) {
        return this.getNoise().getRelDirections(pos, this.flat, this.scale, this.jitter, this.metric, this.maxCheck);
    }
    static fromJson(obj, _parser) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new CachedVoronoiDF(parseSalt(root.salt), Json.readBoolean(root.flat) ?? true, Json.readNumber(root.scale) ?? 100, Json.readNumber(root.jitter) ?? 0.4, Json.readInt(root.metric) ?? 1, Json.readInt(root.maxCheck ?? root.max_check) ?? 3);
    }
}
//======// 3. PullFromCachedVoronoiDF //===========================================================//
export class PullFromCachedVoronoiDF extends DensityFunction {
    mode;
    ordinal;
    cache;
    _cachedVoronoi;
    constructor(mode = 0, ordinal = 1, cache) {
        super();
        this.mode = mode;
        this.ordinal = ordinal;
        this.cache = cache;
    }
    get cachedVoronoi() {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }
    compute(context) {
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
    range() {
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
    mapChildren(visitor) {
        return new PullFromCachedVoronoiDF(this.mode, this.ordinal, visitor.apply(this.cache));
    }
    initialized() {
        return this.cachedVoronoi.initialized();
    }
    initialize(levelSeed) {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new PullFromCachedVoronoiDF(Json.readInt(root.mode) ?? 0, Json.readInt(root.ordinal) ?? 1, parser(root.cache ?? root.cached_voronoi));
    }
}
//======// 4. VoronoiDistanceDF //================================================================//
export class VoronoiDistanceDF extends DensityFunction {
    salt;
    flat;
    scale;
    jitter;
    metric;
    rel;
    ordinal;
    noise;
    _initialized = false;
    constructor(salt = 0n, flat = true, scale = 100, jitter = 0.4, metric = 1, rel = false, ordinal = 1, noise) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.rel = rel;
        this.ordinal = ordinal;
        this.noise = noise;
        if (noise)
            this._initialized = true;
    }
    getNoise() {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }
    compute(context) {
        return this.getNoise().getDistance(context, this.flat, this.scale, this.jitter, this.metric, this.ordinal, this.rel);
    }
    range() {
        return Interval.of(0, Infinity);
    }
    mapChildren(_visitor) {
        return this;
    }
    initialized() {
        return this._initialized;
    }
    initialize(levelSeed) {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }
    static fromJson(obj, _parser) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new VoronoiDistanceDF(parseSalt(root.salt), Json.readBoolean(root.flat) ?? true, Json.readNumber(root.scale) ?? 100, Json.readNumber(root.jitter) ?? 0.4, Json.readInt(root.metric) ?? 1, Json.readBoolean(root.rel) ?? false, Json.readInt(root.ordinal) ?? 1);
    }
}
//======// 5. VoronoiCenterDF //==================================================================//
export class VoronoiCenterDF extends DensityFunction {
    salt;
    flat;
    scale;
    jitter;
    metric;
    ordinal;
    sampler;
    noise;
    _initialized = false;
    constructor(salt = 0n, flat = true, scale = 100, jitter = 0.4, metric = 1, ordinal = 1, sampler = DensityFunction.Constant.ZERO, noise) {
        super();
        this.salt = BigInt(salt);
        this.flat = flat;
        this.scale = scale;
        this.jitter = jitter;
        this.metric = metric;
        this.ordinal = ordinal;
        this.sampler = sampler;
        this.noise = noise;
        if (noise)
            this._initialized = true;
    }
    getNoise() {
        if (!this.noise) {
            this.noise = VoronoiNoise.create(this.salt);
        }
        return this.noise;
    }
    compute(context) {
        const plate = this.getNoise().getPlateAtPos(context, this.flat, this.scale, this.jitter, this.metric, this.ordinal);
        const centerPos = plate.getCenterPos(this.scale, this.flat);
        return this.sampler.compute(centerPos);
    }
    range() {
        return this.sampler.range();
    }
    mapChildren(visitor) {
        return new VoronoiCenterDF(this.salt, this.flat, this.scale, this.jitter, this.metric, this.ordinal, visitor.apply(this.sampler), this.noise);
    }
    initialized() {
        return this._initialized;
    }
    initialize(levelSeed) {
        this.noise = VoronoiNoise.create(levelSeed + this.salt);
        this._initialized = true;
        return this;
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new VoronoiCenterDF(parseSalt(root.salt), Json.readBoolean(root.flat) ?? true, Json.readNumber(root.scale) ?? 100, Json.readNumber(root.jitter) ?? 0.4, Json.readInt(root.metric) ?? 1, Json.readInt(root.ordinal) ?? 1, parser(root.sampler));
    }
}
//======// 6. PullCachedCenterDF //===============================================================//
export class PullCachedCenterDF extends DensityFunction {
    ordinal;
    cache;
    sampler;
    memoSamples = new Map();
    _cachedVoronoi;
    constructor(ordinal = 1, cache, sampler = DensityFunction.Constant.ZERO) {
        super();
        this.ordinal = ordinal;
        this.cache = cache;
        this.sampler = sampler;
    }
    get cachedVoronoi() {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }
    compute(context) {
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
    range() {
        return this.sampler.range();
    }
    mapChildren(visitor) {
        return new PullCachedCenterDF(this.ordinal, visitor.apply(this.cache), visitor.apply(this.sampler));
    }
    initialized() {
        return this.cachedVoronoi.initialized();
    }
    initialize(levelSeed) {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new PullCachedCenterDF(Json.readInt(root.ordinal) ?? 1, parser(root.cache ?? root.cached_voronoi), parser(root.sampler));
    }
}
//======// 7. NearestSeaDF //=====================================================================//
export class NearestSeaDF extends DensityFunction {
    cache;
    peak;
    contBias;
    distanceMode;
    _cachedVoronoi;
    constructor(cache, peak = 0.25, contBias = 0.5, distanceMode = true) {
        super();
        this.cache = cache;
        this.peak = peak;
        this.contBias = contBias;
        this.distanceMode = distanceMode;
    }
    get cachedVoronoi() {
        if (!this._cachedVoronoi) {
            this._cachedVoronoi = unwrapCachedVoronoi(this.cache);
        }
        return this._cachedVoronoi;
    }
    compute(context) {
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
    static distToSea(val, vel, dist, peak, contBias) {
        if (val[0] >= contBias) {
            const len = Math.min(9, val.length);
            for (let j = 1; j < len; j++) {
                if (val[j] < contBias) {
                    if (vel[j] > 0 && dist[j] - dist[0] < peak)
                        return dist[j] - dist[0];
                    if (vel[j] <= 0)
                        return dist[j] - dist[0];
                }
            }
            return 10;
        }
        return 0;
    }
    static dirOfSea(val, vel, dist, dir, peak, contBias) {
        if (val[0] >= contBias) {
            const len = Math.min(9, val.length);
            for (let j = 1; j < len; j++) {
                if (val[j] < contBias) {
                    if (vel[j] > 0 && dist[j] - dist[0] < peak)
                        return dir[j];
                    if (vel[j] <= 0)
                        return dir[j];
                }
            }
            return 10;
        }
        return 0;
    }
    range() {
        return this.distanceMode ? Interval.of(0, 10) : Interval.of(-Math.PI * 1.5, 10);
    }
    mapChildren(visitor) {
        return new NearestSeaDF(visitor.apply(this.cache), this.peak, this.contBias, this.distanceMode);
    }
    initialized() {
        return this.cachedVoronoi.initialized();
    }
    initialize(levelSeed) {
        if (!this.cachedVoronoi.initialized()) {
            this.cachedVoronoi.initialize(levelSeed);
        }
        return this;
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new NearestSeaDF(parser(root.cache ?? root.cached_voronoi), Json.readNumber(root.peak) ?? 0.25, Json.readNumber(root.cont_bias ?? root.contBias) ?? 0.5, Json.readBoolean(root.distance) ?? true);
    }
}
//# sourceMappingURL=density-functions.js.map