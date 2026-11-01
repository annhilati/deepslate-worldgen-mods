import { DensityFunction, Interval } from 'deepslate';
//======// Tectonic: Config Clamp //==============================================================//
export class TectonicConfigClamp extends DensityFunction {
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
        return new TectonicConfigClamp(parser(obj.input ?? obj.argument), parser(obj.min), parser(obj.max));
    }
}
//======// Tectonic: Invert //====================================================================//
export class TectonicInvert extends DensityFunction {
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
//# sourceMappingURL=lib.js.map