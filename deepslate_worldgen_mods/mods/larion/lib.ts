import { DensityFunction, Json } from 'deepslate';
import { Interval, CompatDensityFunction, parseInput, parseLeft, parseRight } from '../../compat/index.js';
import type { InputParser } from '../../types.js';

//======// Larion: Division //===================================================================//

export class LarionDivision extends CompatDensityFunction {
    constructor(
        readonly argument1: DensityFunction,
        readonly argument2: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const dividend = this.argument1.compute(context);
        const divisor = this.argument2.compute(context);

        if (divisor === 0) {
            return 0.0;
        }

        return dividend / divisor;
    }

    range(): Interval {
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

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LarionDivision(
            visitor.apply(this.argument1),
            visitor.apply(this.argument2)
        );
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): LarionDivision {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new LarionDivision(
            parser(parseLeft(root)),
            parser(parseRight(root))
        );
    }
}

//======// Larion: Flat Domain Warp //============================================================//

export class LarionFlatDomainWarp extends CompatDensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly warpX: DensityFunction,
        readonly warpZ: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const xOffset = Math.trunc(this.warpX.compute(context));
        const zOffset = Math.trunc(this.warpZ.compute(context));
        const warpedContext: DensityFunction.Context = {
            ...context,
            x: context.x + xOffset,
            z: context.z + zOffset,
        };
        return this.input.compute(warpedContext);
    }

    range(): Interval {
        return this.input.range();
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LarionFlatDomainWarp(
            visitor.apply(this.input),
            visitor.apply(this.warpX),
            visitor.apply(this.warpZ)
        );
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): LarionFlatDomainWarp {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new LarionFlatDomainWarp(
            parser(parseInput(root)),
            parser(root.warp_x ?? (root as any).warpX),
            parser(root.warp_z ?? (root as any).warpZ)
        );
    }
}

//======// Larion: Signum //======================================================================//

export class LarionSignum extends CompatDensityFunction {
    constructor(readonly argument: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.sign(this.argument.compute(context));
    }

    range(): Interval {
        const minVal = Math.sign(this.argument.range().min);
        const maxVal = Math.sign(this.argument.range().max);
        return Interval.of(Math.min(minVal, maxVal), Math.max(minVal, maxVal));
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LarionSignum(visitor.apply(this.argument));
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): LarionSignum {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new LarionSignum(parser(parseInput(root)));
    }
}

//======// Larion: Sine //========================================================================//

export class LarionSine extends CompatDensityFunction {
    constructor(readonly argument: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.sin(this.argument.compute(context));
    }

    range(): Interval {
        return Interval.of(-1, 1);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LarionSine(visitor.apply(this.argument));
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): LarionSine {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new LarionSine(parser(parseInput(root)));
    }
}

//======// Larion: Sqrt //========================================================================//

export class LarionSqrt extends CompatDensityFunction {
    constructor(readonly argument: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const val = this.argument.compute(context);
        return val <= 0 ? 0 : Math.sqrt(val);
    }

    range(): Interval {
        const minInput = this.argument.range().min;
        const maxInput = this.argument.range().max;
        const minVal = minInput <= 0 ? 0 : Math.sqrt(minInput);
        const maxVal = maxInput <= 0 ? 0 : Math.sqrt(maxInput);
        return Interval.of(minVal, maxVal);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new LarionSqrt(visitor.apply(this.argument));
    }

    static fromJson(obj: unknown, parser: InputParser = DensityFunction.fromJson): LarionSqrt {
        const root = Json.readObject(obj) ?? (obj as Record<string, unknown>) ?? {};
        return new LarionSqrt(parser(parseInput(root)));
    }
}

//======// Larion: XCoord //======================================================================//

export class LarionXCoord extends CompatDensityFunction {
    private static readonly RANGE = Interval.of(-30_000_000, 30_000_000);

    compute(context: DensityFunction.Context): number {
        return Math.min(Math.max(context.x, -30_000_000), 30_000_000);
    }

    range(): Interval {
        return LarionXCoord.RANGE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(_obj?: unknown, _parser?: InputParser): LarionXCoord {
        return new LarionXCoord();
    }
}

//======// Larion: ZCoord //======================================================================//

export class LarionZCoord extends CompatDensityFunction {
    private static readonly RANGE = Interval.of(-30_000_000, 30_000_000);

    compute(context: DensityFunction.Context): number {
        return Math.min(Math.max(context.z, -30_000_000), 30_000_000);
    }

    range(): Interval {
        return LarionZCoord.RANGE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(_obj?: unknown, _parser?: InputParser): LarionZCoord {
        return new LarionZCoord();
    }
}
