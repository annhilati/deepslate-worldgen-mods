import { DensityFunction, Holder, Identifier, Interval, Registry } from 'deepslate';
import FastNoiseLite from 'fastnoise-lite';
import type { InputParser } from '../types.js';

/** Ensures the custom Registry for FastNoiseConfig exists in Deepslate. */
export function ensureFastNoiseRegistry(): void {
    const key = Identifier.parse('lithostitched:fast_noise_config');
    if (!Registry.REGISTRY.has(key)) {
        const registry = new Registry(key, (obj: any) => obj);
        Registry.REGISTRY.register(registry.key, registry);
    }
}

//======// 1. Sqrt //=============================================================================//

export class LithostitchedSqrt extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.sqrt(Math.max(0, this.input.compute(context)));
    }

    range(): Interval {
        const { min, max } = this.input.range();
        return Interval.of(Math.sqrt(Math.max(0, min)), Math.sqrt(Math.max(0, max)));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedSqrt(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedSqrt {
        return new LithostitchedSqrt(parser(obj.argument));
    }
}

//======// 2. Axis //=============================================================================//

export class LithostitchedAxis extends DensityFunction {
    constructor(readonly axis: 'x' | 'y' | 'z') {
        super();
    }

    compute(context: DensityFunction.Context): number {
        if (this.axis === 'x') return context.x;
        if (this.axis === 'y') return context.y;
        return context.z;
    }

    range(): Interval {
        return this.axis === 'y' ? Interval.of(-4064, 4064) : Interval.INFINITE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(obj: any): LithostitchedAxis {
        return new LithostitchedAxis(obj.axis);
    }
}

//======// 3. Ceil //=============================================================================//

export class LithostitchedCeil extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.ceil(this.input.compute(context));
    }

    range(): Interval {
        const { min, max } = this.input.range();
        return Interval.of(Math.ceil(min), Math.ceil(max));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedCeil(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedCeil {
        return new LithostitchedCeil(parser(obj.argument));
    }
}

//======// 4. Floor //============================================================================//

export class LithostitchedFloor extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.floor(this.input.compute(context));
    }

    range(): Interval {
        const { min, max } = this.input.range();
        return Interval.of(Math.floor(min), Math.floor(max));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedFloor(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedFloor {
        return new LithostitchedFloor(parser(obj.argument));
    }
}

//======// 5. Sin //==============================================================================//

export class LithostitchedSin extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.sin(this.input.compute(context));
    }

    range(): Interval {
        return Interval.of(-1, 1);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedSin(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedSin {
        return new LithostitchedSin(parser(obj.argument));
    }
}

//======// 6. Cos //==============================================================================//

export class LithostitchedCos extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.cos(this.input.compute(context));
    }

    range(): Interval {
        return Interval.of(-1, 1);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedCos(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedCos {
        return new LithostitchedCos(parser(obj.argument));
    }
}

//======// 7. Mix //==============================================================================//

export class LithostitchedMix extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly arg1: DensityFunction,
        readonly arg2: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const i = this.input.compute(context);
        if (i <= 0) return this.arg1.compute(context);
        if (i >= 1) return this.arg2.compute(context);
        return this.arg1.compute(context) * (1 - i) + this.arg2.compute(context) * i;
    }

    range(): Interval {
        const r1 = this.arg1.range();
        const r2 = this.arg2.range();
        return Interval.of(Math.min(r1.min, r2.min), Math.max(r1.max, r2.max));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedMix(
            visitor.apply(this.input),
            visitor.apply(this.arg1),
            visitor.apply(this.arg2)
        );
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedMix {
        return new LithostitchedMix(
            parser(obj.input),
            parser(obj.argument1),
            parser(obj.argument2)
        );
    }
}

//======// 8. Select //===========================================================================//

export class LithostitchedSelect extends DensityFunction {
    readonly min: number;
    readonly max: number;

    constructor(
        readonly input: DensityFunction,
        readonly fallback: DensityFunction,
        readonly selections: { range: [number, number]; function: DensityFunction }[]
    ) {
        super();
        let curMin = fallback.range().min;
        let curMax = fallback.range().max;
        for (const s of selections) {
            curMin = Math.min(curMin, s.function.range().min);
            curMax = Math.max(curMax, s.function.range().max);
        }
        this.min = curMin;
        this.max = curMax;
    }

    compute(context: DensityFunction.Context): number {
        const val = this.input.compute(context);
        for (const sel of this.selections) {
            if (val >= sel.range[0] && val <= sel.range[1]) {
                return sel.function.compute(context);
            }
        }
        return this.fallback.compute(context);
    }

    range(): Interval {
        return Interval.of(this.min, this.max);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedSelect(
            visitor.apply(this.input),
            visitor.apply(this.fallback),
            this.selections.map(s => ({ range: s.range, function: visitor.apply(s.function) }))
        );
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedSelect {
        const data = obj.select || obj;
        const selections = (data.selections || []).map((s: any) => {
            let range = s.range;
            if (!Array.isArray(range)) range = [range, range];
            return { range: range as [number, number], function: parser(s.function) };
        });
        return new LithostitchedSelect(parser(data.input), parser(data.fallback), selections);
    }
}

//======// 9. Shift //============================================================================//

export class LithostitchedShift extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly shiftX: DensityFunction,
        readonly shiftY: DensityFunction,
        readonly shiftZ: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const x = context.x + this.shiftX.compute(context);
        const y = context.y + this.shiftY.compute(context);
        const z = context.z + this.shiftZ.compute(context);
        return this.input.compute({ x, y, z });
    }

    range(): Interval {
        return this.input.range();
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedShift(
            visitor.apply(this.input),
            visitor.apply(this.shiftX),
            visitor.apply(this.shiftY),
            visitor.apply(this.shiftZ)
        );
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedShift {
        return new LithostitchedShift(
            parser(obj.input),
            parser(obj.shift_x),
            parser(obj.shift_y),
            parser(obj.shift_z)
        );
    }
}

//======// 10. Markers //=========================================================================//

export class LithostitchedMarker extends DensityFunction {
    compute(_context: DensityFunction.Context): number { return 0; }
    range(): Interval { return Interval.of(0, 0); }
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction { return this; }
    static fromJson(): LithostitchedMarker { return new LithostitchedMarker(); }
}

//======// 11. FastNoise //=======================================================================//

export class LithostitchedFastNoise extends DensityFunction {
    readonly fnl: FastNoiseLite;
    private initializedConfig: any = null;

    constructor(
        readonly configHolder: Holder<any>,
        readonly xzScale: number,
        readonly yScale: number,
        readonly shiftX: DensityFunction,
        readonly shiftY: DensityFunction,
        readonly shiftZ: DensityFunction
    ) {
        super();
        this.fnl = new FastNoiseLite();
    }

    applyConfig(configData: any): void {
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
                }[configData.distance_function as string];
                if (df) this.fnl.SetCellularDistanceFunction(df);
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
                }[configData.return_type as string];
                if (rt) this.fnl.SetCellularReturnType(rt);
            }
            if (configData.jitter !== undefined) {
                this.fnl.SetCellularJitter(configData.jitter);
            }
        } else if (type === 'perlin') {
            this.fnl.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        } else if (type === 'simplex') {
            this.fnl.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2S);
            if (configData.fractal_type) {
                const ft = {
                    'none': FastNoiseLite.FractalType.None,
                    'fbm': FastNoiseLite.FractalType.FBm,
                    'ridged': FastNoiseLite.FractalType.Ridged,
                    'ping_pong': FastNoiseLite.FractalType.PingPong,
                    'domain_warp_progressive': FastNoiseLite.FractalType.DomainWarpProgressive,
                    'domain_warp_independent': FastNoiseLite.FractalType.DomainWarpIndependent
                }[configData.fractal_type as string];
                if (ft) this.fnl.SetFractalType(ft);
            } else {
                this.fnl.SetFractalType(FastNoiseLite.FractalType.None);
            }
            if (configData.octaves !== undefined) this.fnl.SetFractalOctaves(configData.octaves);
            if (configData.lacunarity !== undefined) this.fnl.SetFractalLacunarity(configData.lacunarity);
            if (configData.gain !== undefined) this.fnl.SetFractalGain(configData.gain);
        }
    }

    compute(context: DensityFunction.Context): number {
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

    range(): Interval { return Interval.of(-1, 1); }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LithostitchedFastNoise(
            this.configHolder,
            this.xzScale,
            this.yScale,
            visitor.apply(this.shiftX),
            visitor.apply(this.shiftY),
            visitor.apply(this.shiftZ)
        );
    }

    static fromJson(obj: any, parser: InputParser): LithostitchedFastNoise {
        ensureFastNoiseRegistry();
        const registry = Registry.REGISTRY.get(Identifier.parse('lithostitched:fast_noise_config'));
        const configHolder = Holder.parser(registry, (o: any) => o)(obj.config);

        return new LithostitchedFastNoise(
            configHolder,
            obj.xz_scale ?? 1.0,
            obj.y_scale ?? 1.0,
            obj.shift_x ? parser(obj.shift_x) : new DensityFunction.Constant(0),
            obj.shift_y ? parser(obj.shift_y) : new DensityFunction.Constant(0),
            obj.shift_z ? parser(obj.shift_z) : new DensityFunction.Constant(0)
        );
    }
}
