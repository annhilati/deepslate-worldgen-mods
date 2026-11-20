import { DensityFunction, Interval, Json } from 'deepslate';
import type { InputParser } from '../types.js';
import { TECTONIC_CONFIG } from './config.js';

export * from './config.js';

//======// Tectonic: Config Clamp //==============================================================//

export class TectonicConfigClamp extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly min: DensityFunction,
        readonly max: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.min(
            Math.max(this.input.compute(context), this.min.compute(context)),
            this.max.compute(context)
        );
    }

    range(): Interval {
        return Interval.of(this.min.range().min, this.max.range().max);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new TectonicConfigClamp(
            visitor.apply(this.input),
            visitor.apply(this.min),
            visitor.apply(this.max)
        );
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): TectonicConfigClamp {
        return new TectonicConfigClamp(
            parser(obj.input ?? obj.argument),
            parser(obj.min),
            parser(obj.max)
        );
    }
}

//======// Tectonic: Invert //====================================================================//

export class TectonicInvert extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly minVal: number,
        readonly maxVal: number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return 1.0 / this.input.compute(context);
    }

    range(): Interval {
        return Interval.of(this.minVal, this.maxVal);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new TectonicInvert(visitor.apply(this.input), this.minVal, this.maxVal);
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): TectonicInvert {
        const parsedInput = parser(obj.input ?? obj.argument);
        const { min, max } = parsedInput.range();

        let invertMin = min;
        let invertMax = max;
        if (min < 0 && max > 0) {
            invertMin = -Infinity;
            invertMax = Infinity;
        }
        return new TectonicInvert(parsedInput, invertMin, invertMax);
    }
}

//======// Tectonic: Config Constant //===========================================================//

export class TectonicConfigConstant extends DensityFunction {
    readonly key: string;
    readonly value: number;

    constructor(key: string, value?: number) {
        super();
        this.key = key;
        this.value = value ?? TECTONIC_CONFIG.getConstant(key);
    }

    compute(_context: DensityFunction.Context): number {
        return this.value;
    }

    range(): Interval {
        return Interval.ofExact(this.value);
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(obj: unknown, _parser?: InputParser): TectonicConfigConstant {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        const key = Json.readString(root.key ?? (root as any).argument) ?? '';
        return new TectonicConfigConstant(key);
    }
}

//======// Tectonic: Config Noise //==============================================================//

export class TectonicConfigNoise extends DensityFunction {
    readonly key: string;
    readonly noise: any;
    readonly shiftX: DensityFunction;
    readonly shiftZ: DensityFunction;
    readonly scale: number;
    readonly multiplier: number;
    readonly offset: number;
    readonly smootherScaling: boolean;
    readonly noiseSampler?: any;

    constructor(
        key: string,
        noise: any,
        shiftX: DensityFunction,
        shiftZ: DensityFunction,
        scale: number,
        multiplier: number = 1.0,
        offset: number = 0.0,
        smootherScaling: boolean = false,
        noiseSampler?: any
    ) {
        super();
        this.key = key;
        this.noise = noise;
        this.shiftX = shiftX;
        this.shiftZ = shiftZ;
        this.scale = scale;
        this.multiplier = multiplier;
        this.offset = offset;
        this.smootherScaling = smootherScaling;
        this.noiseSampler = noiseSampler;
    }

    compute(context: DensityFunction.Context): number {
        let x: number;
        let z: number;
        if (this.smootherScaling) {
            x = (context.x + this.shiftX.compute(context)) * this.scale;
            z = (context.z + this.shiftZ.compute(context)) * this.scale;
        } else {
            x = context.x * this.scale + this.shiftX.compute(context);
            z = context.z * this.scale + this.shiftZ.compute(context);
        }

        let rawVal = 0;
        if (this.noiseSampler) {
            if (typeof this.noiseSampler.get3D === 'function') {
                rawVal = this.noiseSampler.get3D(x, 0, z);
            } else if (typeof this.noiseSampler.getValue === 'function') {
                rawVal = this.noiseSampler.getValue(x, 0, z);
            } else if (typeof this.noiseSampler.get2D === 'function') {
                rawVal = this.noiseSampler.get2D(x, z);
            }
        }
        return rawVal * this.multiplier + this.offset;
    }

    range(): Interval {
        if (!this.noiseSampler || typeof this.noiseSampler.range !== 'function') {
            return Interval.INFINITE;
        }
        const base = this.noiseSampler.range();
        const minVal = base.min * this.multiplier + this.offset;
        const maxVal = base.max * this.multiplier + this.offset;
        return Interval.of(Math.min(minVal, maxVal), Math.max(minVal, maxVal));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        const nextNoiseSampler = (visitor as any).getNoiseSampler?.(this.noise) ??
            (visitor as any).visitNoise?.(this.noise) ??
            this.noiseSampler;

        return new TectonicConfigNoise(
            this.key,
            this.noise,
            visitor.apply(this.shiftX),
            visitor.apply(this.shiftZ),
            this.scale,
            this.multiplier,
            this.offset,
            this.smootherScaling,
            nextNoiseSampler
        );
    }

    withNewNoise(noiseSampler: any): TectonicConfigNoise {
        return new TectonicConfigNoise(
            this.key,
            this.noise,
            this.shiftX,
            this.shiftZ,
            this.scale,
            this.multiplier,
            this.offset,
            this.smootherScaling,
            noiseSampler
        );
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): TectonicConfigNoise {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        const key = Json.readString(root.key) ?? '';
        const state = TECTONIC_CONFIG.getNoiseState(key);

        const noise = root.noise;
        const shiftX = parser(root.shift_x ?? root.shiftX ?? DensityFunction.Constant.ZERO);
        const shiftZ = parser(root.shift_z ?? root.shiftZ ?? DensityFunction.Constant.ZERO);

        return new TectonicConfigNoise(
            key,
            noise,
            shiftX,
            shiftZ,
            state.scale,
            state.multiplier,
            state.offset,
            state.smootherScaling
        );
    }
}
