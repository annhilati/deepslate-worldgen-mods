import { DensityFunction, Interval, LegacyRandom, SimplexNoise } from 'deepslate';
import type { InputParser } from '../types.js';

//======// En-sity: Lonely Island //==============================================================//

export class EnsityLonelyIsland extends DensityFunction {
    compute(context: DensityFunction.Context): number {
        const x = Math.floor(context.x / 8);
        const z = Math.floor(context.z / 8);
        const h = Math.sqrt(x * x + z * z) * 8.0;
        const val = Math.max(-100.0, Math.min(80.0, 100.0 - h));
        return (val - 8.0) / 128.0;
    }

    private static readonly RANGE = Interval.of(-0.84375, 0.5625);

    range(): Interval {
        return EnsityLonelyIsland.RANGE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(_obj?: unknown, _parser?: InputParser): EnsityLonelyIsland {
        return new EnsityLonelyIsland();
    }
}

//======// En-sity: Floating Islands //===========================================================//

export class EnsityFloatingIslands extends DensityFunction {
    readonly islandNoise: SimplexNoise;

    constructor(seed: bigint = 0n) {
        super();
        const randomSource: any = new LegacyRandom(seed);
        if (typeof randomSource.consumeCount === 'function') {
            randomSource.consumeCount(17292);
        } else if (typeof randomSource.consume === 'function') {
            randomSource.consume(17292);
        } else if (typeof randomSource.advance === 'function') {
            randomSource.advance(17292);
        } else {
            for (let i = 0; i < 17292; i++) randomSource.nextInt();
        }
        this.islandNoise = new SimplexNoise(randomSource);
    }

    getHeightValue(x: number, z: number): number {
        let i = Math.floor(x / 2);
        x = x % 2;
        let j = Math.floor(z / 2);
        z = z % 2;
        let f = -100.0;

        for (let m = -12; m <= 12; ++m) {
            for (let n = -12; n <= 12; ++n) {
                const o = i + m;
                const p = j + n;
                const sample = typeof this.islandNoise.get2D === 'function'
                    ? this.islandNoise.get2D(o, p)
                    : (this.islandNoise as any).sample2D(o, p);
                if (sample < -0.8999999761581421) {
                    const g = (Math.abs(o) * 3439.0 + Math.abs(p) * 147.0) % 13.0 + 9.0;
                    const h = x - m * 2;
                    const q = z - n * 2;
                    const r = 100.0 - Math.sqrt(h * h + q * q) * g;
                    f = Math.max(f, Math.max(-100.0, Math.min(80.0, r)));
                }
            }
        }
        return f;
    }

    compute(context: DensityFunction.Context): number {
        return (this.getHeightValue(Math.floor(context.x / 8), Math.floor(context.z / 8)) - 8.0) / 128.0;
    }

    private static readonly RANGE = Interval.of(-0.84375, 0.5625);

    range(): Interval {
        return EnsityFloatingIslands.RANGE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static fromJson(_obj?: unknown, _parser?: InputParser): EnsityFloatingIslands {
        return new EnsityFloatingIslands(0n);
    }
}
