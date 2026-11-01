import { DensityFunction, Holder, Identifier, Interval, Registry } from 'deepslate';
import FastNoiseLite from 'fastnoise-lite';
/** Ensures the custom Registry for FastNoiseConfig exists in Deepslate. */
export function ensureFastNoiseRegistry() {
    const key = Identifier.parse('lithostitched:fast_noise_config');
    if (!Registry.REGISTRY.has(key)) {
        const registry = new Registry(key, (obj) => obj);
        Registry.REGISTRY.register(registry.key, registry);
    }
}
//======// 1. Sqrt //=============================================================================//
export class LithostitchedSqrt extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return Math.sqrt(Math.max(0, this.input.compute(context)));
    }
    range() {
        const { min, max } = this.input.range();
        return Interval.of(Math.sqrt(Math.max(0, min)), Math.sqrt(Math.max(0, max)));
    }
    mapChildren(visitor) {
        return new LithostitchedSqrt(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedSqrt(parser(obj.input ?? obj.argument));
    }
}
//======// 2. Axis //=============================================================================//
export class LithostitchedAxis extends DensityFunction {
    axis;
    constructor(axis) {
        super();
        this.axis = axis;
    }
    compute(context) {
        if (this.axis === 'x')
            return context.x;
        if (this.axis === 'y')
            return context.y;
        return context.z;
    }
    range() {
        return this.axis === 'y' ? Interval.of(-4064, 4064) : Interval.INFINITE;
    }
    mapChildren(_visitor) {
        return this;
    }
    static fromJson(obj) {
        return new LithostitchedAxis(obj.axis);
    }
}
//======// 3. Ceil //=============================================================================//
export class LithostitchedCeil extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return Math.ceil(this.input.compute(context));
    }
    range() {
        const { min, max } = this.input.range();
        return Interval.of(Math.ceil(min), Math.ceil(max));
    }
    mapChildren(visitor) {
        return new LithostitchedCeil(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedCeil(parser(obj.input ?? obj.argument));
    }
}
//======// 4. Floor //============================================================================//
export class LithostitchedFloor extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return Math.floor(this.input.compute(context));
    }
    range() {
        const { min, max } = this.input.range();
        return Interval.of(Math.floor(min), Math.floor(max));
    }
    mapChildren(visitor) {
        return new LithostitchedFloor(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedFloor(parser(obj.input ?? obj.argument));
    }
}
//======// 5. Sin //==============================================================================//
export class LithostitchedSin extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return Math.sin(this.input.compute(context));
    }
    range() {
        return Interval.of(-1, 1);
    }
    mapChildren(visitor) {
        return new LithostitchedSin(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedSin(parser(obj.input ?? obj.argument));
    }
}
//======// 6. Cos //==============================================================================//
export class LithostitchedCos extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return Math.cos(this.input.compute(context));
    }
    range() {
        return Interval.of(-1, 1);
    }
    mapChildren(visitor) {
        return new LithostitchedCos(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedCos(parser(obj.input ?? obj.argument));
    }
}
//======// 7. Mix //==============================================================================//
export class LithostitchedMix extends DensityFunction {
    input;
    arg1;
    arg2;
    constructor(input, arg1, arg2) {
        super();
        this.input = input;
        this.arg1 = arg1;
        this.arg2 = arg2;
    }
    compute(context) {
        const i = this.input.compute(context);
        if (i <= 0)
            return this.arg1.compute(context);
        if (i >= 1)
            return this.arg2.compute(context);
        return this.arg1.compute(context) * (1 - i) + this.arg2.compute(context) * i;
    }
    range() {
        const r1 = this.arg1.range();
        const r2 = this.arg2.range();
        return Interval.of(Math.min(r1.min, r2.min), Math.max(r1.max, r2.max));
    }
    mapChildren(visitor) {
        return new LithostitchedMix(visitor.apply(this.input), visitor.apply(this.arg1), visitor.apply(this.arg2));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedMix(parser(obj.input ?? obj.argument), parser(obj.argument1 ?? obj.arg1 ?? obj.left), parser(obj.argument2 ?? obj.arg2 ?? obj.right));
    }
}
//======// 8. Select //===========================================================================//
export class LithostitchedSelect extends DensityFunction {
    input;
    fallback;
    selections;
    min;
    max;
    constructor(input, fallback, selections) {
        super();
        this.input = input;
        this.fallback = fallback;
        this.selections = selections;
        let curMin = fallback.range().min;
        let curMax = fallback.range().max;
        for (const s of selections) {
            curMin = Math.min(curMin, s.function.range().min);
            curMax = Math.max(curMax, s.function.range().max);
        }
        this.min = curMin;
        this.max = curMax;
    }
    compute(context) {
        const val = this.input.compute(context);
        for (const sel of this.selections) {
            if (val >= sel.range[0] && val <= sel.range[1]) {
                return sel.function.compute(context);
            }
        }
        return this.fallback.compute(context);
    }
    range() {
        return Interval.of(this.min, this.max);
    }
    mapChildren(visitor) {
        return new LithostitchedSelect(visitor.apply(this.input), visitor.apply(this.fallback), this.selections.map(s => ({ range: s.range, function: visitor.apply(s.function) })));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const data = obj.select || obj;
        const selections = (data.selections || []).map((s) => {
            let range = s.range;
            if (!Array.isArray(range))
                range = [range, range];
            return { range: range, function: parser(s.function) };
        });
        return new LithostitchedSelect(parser(data.input ?? data.argument), parser(data.fallback), selections);
    }
}
//======// 9. Shift //============================================================================//
export class LithostitchedShift extends DensityFunction {
    input;
    shiftX;
    shiftY;
    shiftZ;
    constructor(input, shiftX, shiftY, shiftZ) {
        super();
        this.input = input;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.shiftZ = shiftZ;
    }
    compute(context) {
        const x = context.x + this.shiftX.compute(context);
        const y = context.y + this.shiftY.compute(context);
        const z = context.z + this.shiftZ.compute(context);
        return this.input.compute({ x, y, z });
    }
    range() {
        return this.input.range();
    }
    mapChildren(visitor) {
        return new LithostitchedShift(visitor.apply(this.input), visitor.apply(this.shiftX), visitor.apply(this.shiftY), visitor.apply(this.shiftZ));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new LithostitchedShift(parser(obj.input ?? obj.argument), parser(obj.shift_x), parser(obj.shift_y), parser(obj.shift_z));
    }
}
//======// 10. Markers //=========================================================================//
export class LithostitchedMarker extends DensityFunction {
    compute(_context) { return 0; }
    range() { return Interval.of(0, 0); }
    mapChildren(_visitor) { return this; }
    static fromJson() { return new LithostitchedMarker(); }
}
//======// 11. FastNoise //=======================================================================//
export class LithostitchedFastNoise extends DensityFunction {
    configHolder;
    xzScale;
    yScale;
    shiftX;
    shiftY;
    shiftZ;
    fnl;
    initializedConfig = null;
    constructor(configHolder, xzScale, yScale, shiftX, shiftY, shiftZ) {
        super();
        this.configHolder = configHolder;
        this.xzScale = xzScale;
        this.yScale = yScale;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.shiftZ = shiftZ;
        this.fnl = new FastNoiseLite();
    }
    applyConfig(configData) {
        const type = configData.type?.split(':').pop();
        this.fnl.SetFrequency(configData.frequency ?? 0.02);
        if (configData.salt !== undefined) {
            this.fnl.SetSeed(configData.salt);
        }
        if (type === 'cellular') {
            this.fnl.SetNoiseType(FastNoiseLite.NoiseType.Cellular);
            if (configData.distance_function) {
                const df = {
                    'euclidean': FastNoiseLite.CellularDistanceFunction.Euclidean,
                    'euclidean_squared': FastNoiseLite.CellularDistanceFunction.EuclideanSq,
                    'manhattan': FastNoiseLite.CellularDistanceFunction.Manhattan,
                    'hybrid': FastNoiseLite.CellularDistanceFunction.Hybrid
                }[configData.distance_function];
                if (df)
                    this.fnl.SetCellularDistanceFunction(df);
            }
            if (configData.return_type) {
                const rt = {
                    'cell_value': FastNoiseLite.CellularReturnType.CellValue,
                    'distance': FastNoiseLite.CellularReturnType.Distance,
                    'distance_2': FastNoiseLite.CellularReturnType.Distance2,
                    'distance_2_add': FastNoiseLite.CellularReturnType.Distance2Add,
                    'distance_2_sub': FastNoiseLite.CellularReturnType.Distance2Sub,
                    'distance_2_mul': FastNoiseLite.CellularReturnType.Distance2Mul,
                    'distance_2_div': FastNoiseLite.CellularReturnType.Distance2Div
                }[configData.return_type];
                if (rt)
                    this.fnl.SetCellularReturnType(rt);
            }
            if (configData.jitter !== undefined) {
                this.fnl.SetCellularJitter(configData.jitter);
            }
        }
        else if (type === 'perlin') {
            this.fnl.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        }
        else if (type === 'simplex') {
            this.fnl.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2S);
            if (configData.fractal_type) {
                const ft = {
                    'none': FastNoiseLite.FractalType.None,
                    'fbm': FastNoiseLite.FractalType.FBm,
                    'ridged': FastNoiseLite.FractalType.Ridged,
                    'ping_pong': FastNoiseLite.FractalType.PingPong,
                    'domain_warp_progressive': FastNoiseLite.FractalType.DomainWarpProgressive,
                    'domain_warp_independent': FastNoiseLite.FractalType.DomainWarpIndependent
                }[configData.fractal_type];
                if (ft)
                    this.fnl.SetFractalType(ft);
            }
            else {
                this.fnl.SetFractalType(FastNoiseLite.FractalType.None);
            }
            if (configData.octaves !== undefined)
                this.fnl.SetFractalOctaves(configData.octaves);
            if (configData.lacunarity !== undefined)
                this.fnl.SetFractalLacunarity(configData.lacunarity);
            if (configData.gain !== undefined)
                this.fnl.SetFractalGain(configData.gain);
        }
    }
    compute(context) {
        const configData = this.configHolder.value();
        if (this.initializedConfig !== configData) {
            this.initializedConfig = configData;
            this.applyConfig(configData);
        }
        const x = context.x * this.xzScale + this.shiftX.compute(context);
        const y = context.y * this.yScale + this.shiftY.compute(context);
        const z = context.z * this.xzScale + this.shiftZ.compute(context);
        return this.fnl.GetNoise(x, y, z);
    }
    range() { return Interval.of(-1, 1); }
    mapChildren(visitor) {
        return new LithostitchedFastNoise(this.configHolder, this.xzScale, this.yScale, visitor.apply(this.shiftX), visitor.apply(this.shiftY), visitor.apply(this.shiftZ));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        ensureFastNoiseRegistry();
        const registry = Registry.REGISTRY.get(Identifier.parse('lithostitched:fast_noise_config'));
        const configHolder = Holder.parser(registry, (o) => o)(obj.config);
        return new LithostitchedFastNoise(configHolder, obj.xz_scale ?? 1.0, obj.y_scale ?? 1.0, obj.shift_x ? parser(obj.shift_x) : new DensityFunction.Constant(0), obj.shift_y ? parser(obj.shift_y) : new DensityFunction.Constant(0), obj.shift_z ? parser(obj.shift_z) : new DensityFunction.Constant(0));
    }
}
//# sourceMappingURL=lib.js.map