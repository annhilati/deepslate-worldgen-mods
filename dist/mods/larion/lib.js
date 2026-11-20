import { DensityFunction, Json } from 'deepslate';
import { Interval, CompatDensityFunction, parseInput, parseLeft, parseRight } from '../../compat/index.js';
//======// Larion: Division //===================================================================//
export class LarionDivision extends CompatDensityFunction {
    argument1;
    argument2;
    constructor(argument1, argument2) {
        super();
        this.argument1 = argument1;
        this.argument2 = argument2;
    }
    compute(context) {
        const dividend = this.argument1.compute(context);
        const divisor = this.argument2.compute(context);
        if (divisor === 0) {
            return 0.0;
        }
        return dividend / divisor;
    }
    range() {
        const min2 = this.argument2.range().min;
        const max2 = this.argument2.range().max;
        const min1 = this.argument1.range().min;
        const max1 = this.argument1.range().max;
        if (min2 === 0 || max2 === 0 || (min2 < 0 && max2 > 0)) {
            return Interval.INFINITE;
        }
        const minVal = min2 === 0 ? 0 : min1 / min2;
        const maxVal = max2 === 0 ? 0 : max1 / max2;
        return Interval.of(Math.min(minVal, maxVal), Math.max(minVal, maxVal));
    }
    mapChildren(visitor) {
        return new LarionDivision(visitor.apply(this.argument1), visitor.apply(this.argument2));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new LarionDivision(parser(parseLeft(root)), parser(parseRight(root)));
    }
}
//======// Larion: Flat Domain Warp //============================================================//
export class LarionFlatDomainWarp extends CompatDensityFunction {
    input;
    warpX;
    warpZ;
    constructor(input, warpX, warpZ) {
        super();
        this.input = input;
        this.warpX = warpX;
        this.warpZ = warpZ;
    }
    compute(context) {
        const xOffset = Math.trunc(this.warpX.compute(context));
        const zOffset = Math.trunc(this.warpZ.compute(context));
        const warpedContext = {
            ...context,
            x: context.x + xOffset,
            z: context.z + zOffset,
        };
        return this.input.compute(warpedContext);
    }
    range() {
        return this.input.range();
    }
    mapChildren(visitor) {
        return new LarionFlatDomainWarp(visitor.apply(this.input), visitor.apply(this.warpX), visitor.apply(this.warpZ));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new LarionFlatDomainWarp(parser(parseInput(root)), parser(root.warp_x ?? root.warpX), parser(root.warp_z ?? root.warpZ));
    }
}
//======// Larion: Signum //======================================================================//
export class LarionSignum extends CompatDensityFunction {
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
    compute(context) {
        return Math.sign(this.argument.compute(context));
    }
    range() {
        const minVal = Math.sign(this.argument.range().min);
        const maxVal = Math.sign(this.argument.range().max);
        return Interval.of(Math.min(minVal, maxVal), Math.max(minVal, maxVal));
    }
    mapChildren(visitor) {
        return new LarionSignum(visitor.apply(this.argument));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new LarionSignum(parser(parseInput(root)));
    }
}
//======// Larion: Sine //========================================================================//
export class LarionSine extends CompatDensityFunction {
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
    compute(context) {
        return Math.sin(this.argument.compute(context));
    }
    range() {
        return Interval.of(-1, 1);
    }
    mapChildren(visitor) {
        return new LarionSine(visitor.apply(this.argument));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new LarionSine(parser(parseInput(root)));
    }
}
//======// Larion: Sqrt //========================================================================//
export class LarionSqrt extends CompatDensityFunction {
    argument;
    constructor(argument) {
        super();
        this.argument = argument;
    }
    compute(context) {
        const val = this.argument.compute(context);
        return val <= 0 ? 0 : Math.sqrt(val);
    }
    range() {
        const minInput = this.argument.range().min;
        const maxInput = this.argument.range().max;
        const minVal = minInput <= 0 ? 0 : Math.sqrt(minInput);
        const maxVal = maxInput <= 0 ? 0 : Math.sqrt(maxInput);
        return Interval.of(minVal, maxVal);
    }
    mapChildren(visitor) {
        return new LarionSqrt(visitor.apply(this.argument));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        const root = Json.readObject(obj) ?? obj ?? {};
        return new LarionSqrt(parser(parseInput(root)));
    }
}
//======// Larion: XCoord //======================================================================//
export class LarionXCoord extends CompatDensityFunction {
    static RANGE = Interval.of(-30_000_000, 30_000_000);
    compute(context) {
        return Math.min(Math.max(context.x, -30_000_000), 30_000_000);
    }
    range() {
        return LarionXCoord.RANGE;
    }
    mapChildren(_visitor) {
        return this;
    }
    static fromJson(_obj, _parser) {
        return new LarionXCoord();
    }
}
//======// Larion: ZCoord //======================================================================//
export class LarionZCoord extends CompatDensityFunction {
    static RANGE = Interval.of(-30_000_000, 30_000_000);
    compute(context) {
        return Math.min(Math.max(context.z, -30_000_000), 30_000_000);
    }
    range() {
        return LarionZCoord.RANGE;
    }
    mapChildren(_visitor) {
        return this;
    }
    static fromJson(_obj, _parser) {
        return new LarionZCoord();
    }
}
//# sourceMappingURL=lib.js.map