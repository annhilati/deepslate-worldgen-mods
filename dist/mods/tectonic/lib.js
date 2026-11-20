import { DensityFunction, Json } from 'deepslate';
import { Interval, CompatDensityFunction, parseInput } from '../../compat/index.js';
import { TECTONIC_CONFIG } from './config.js';
export * from './config.js';
//======// Tectonic: Config Clamp //==============================================================//
export class TectonicConfigClamp extends CompatDensityFunction {
    input;
    min;
    max;
    constructor(input, min, max) {
        super();
        this.input = input;
        this.min = min;
        this.max = max;
    }
    compute(context) {
        return Math.min(Math.max(this.input.compute(context), this.min.compute(context)), this.max.compute(context));
    }
    range() {
        return Interval.of(this.min.range().min, this.max.range().max);
    }
    mapChildren(visitor) {
        return new TectonicConfigClamp(visitor.apply(this.input), visitor.apply(this.min), visitor.apply(this.max));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new TectonicConfigClamp(parser(parseInput(obj)), parser(obj.min), parser(obj.max));
    }
}
//======// Tectonic: Invert //====================================================================//
export class TectonicInvert extends CompatDensityFunction {
    input;
    minVal;
    maxVal;
    constructor(input, minVal, maxVal) {
        super();
        this.input = input;
        this.minVal = minVal;
        this.maxVal = maxVal;
    }
    compute(context) {
        return 1.0 / this.input.compute(context);
    }
    range() {
        return Interval.of(this.minVal, this.maxVal);
    }
    mapChildren(visitor) {
        return new TectonicInvert(visitor.apply(this.input), this.minVal, this.maxVal);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const parsedInput = parser(parseInput(obj));
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
export class TectonicConfigConstant extends CompatDensityFunction {
    key;
    value;
    constructor(key, value) {
        super();
        this.key = key;
        this.value = value ?? TECTONIC_CONFIG.getConstant(key);
    }
    compute(_context) {
        return this.value;
    }
    range() {
        return Interval.ofExact(this.value);
    }
    mapChildren(_visitor) {
        return this;
    }
    static fromJson(obj, _parser) {
        const root = Json.readObject(obj) ?? obj ?? {};
        const key = Json.readString(root.key ?? root.argument) ?? '';
        return new TectonicConfigConstant(key);
    }
}
//======// Tectonic: Config Noise //==============================================================//
export class TectonicConfigNoise extends CompatDensityFunction {
    key;
    noise;
    shiftX;
    shiftZ;
    scale;
    multiplier;
    offset;
    smootherScaling;
    noiseSampler;
    constructor(key, noise, shiftX, shiftZ, scale, multiplier = 1.0, offset = 0.0, smootherScaling = false, noiseSampler) {
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
    compute(context) {
        let x;
        let z;
        if (this.smootherScaling) {
            x = (context.x + this.shiftX.compute(context)) * this.scale;
            z = (context.z + this.shiftZ.compute(context)) * this.scale;
        }
        else {
            x = context.x * this.scale + this.shiftX.compute(context);
            z = context.z * this.scale + this.shiftZ.compute(context);
        }
        let rawVal = 0;
        if (this.noiseSampler) {
            if (typeof this.noiseSampler.get3D === 'function') {
                rawVal = this.noiseSampler.get3D(x, 0, z);
            }
            else if (typeof this.noiseSampler.getValue === 'function') {
                rawVal = this.noiseSampler.getValue(x, 0, z);
            }
            else if (typeof this.noiseSampler.get2D === 'function') {
                rawVal = this.noiseSampler.get2D(x, z);
            }
        }
        return rawVal * this.multiplier + this.offset;
    }
    range() {
        if (!this.noiseSampler || typeof this.noiseSampler.range !== 'function') {
            return Interval.INFINITE;
        }
        const base = this.noiseSampler.range();
        const minVal = base.min * this.multiplier + this.offset;
        const maxVal = base.max * this.multiplier + this.offset;
        return Interval.of(Math.min(minVal, maxVal), Math.max(minVal, maxVal));
    }
    mapChildren(visitor) {
        const nextNoiseSampler = visitor.getNoiseSampler?.(this.noise) ??
            visitor.visitNoise?.(this.noise) ??
            this.noiseSampler;
        return new TectonicConfigNoise(this.key, this.noise, visitor.apply(this.shiftX), visitor.apply(this.shiftZ), this.scale, this.multiplier, this.offset, this.smootherScaling, nextNoiseSampler);
    }
    withNewNoise(noiseSampler) {
        return new TectonicConfigNoise(this.key, this.noise, this.shiftX, this.shiftZ, this.scale, this.multiplier, this.offset, this.smootherScaling, noiseSampler);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        const key = Json.readString(root.key) ?? '';
        const state = TECTONIC_CONFIG.getNoiseState(key);
        const noise = root.noise;
        const shiftX = parser(root.shift_x ?? root.shiftX ?? DensityFunction.Constant.ZERO);
        const shiftZ = parser(root.shift_z ?? root.shiftZ ?? DensityFunction.Constant.ZERO);
        return new TectonicConfigNoise(key, noise, shiftX, shiftZ, state.scale, state.multiplier, state.offset, state.smootherScaling);
    }
}
//# sourceMappingURL=lib.js.map