import { DensityFunction, Interval } from 'deepslate';
import type { InputParser } from '../types.js';

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

    static fromJson(obj: any, parser: InputParser): TectonicConfigClamp {
        return new TectonicConfigClamp(
            parser(obj.input),
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

    static fromJson(obj: any, parser: InputParser): TectonicInvert {
        const parsedInput = parser(obj.argument);
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
