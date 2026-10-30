import { DensityFunction, Interval } from 'deepslate';
import pako from 'pako';
import type { InputParser } from '../types.js';

// Helper Math
function clampedMap(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    if (val <= inMin) return outMin;
    if (val >= inMax) return outMax;
    return outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin));
}

//======// Math Maps //===========================================================================//

export class MoredfsMapped extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly func: (v: number) => number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return this.func(this.input.compute(context));
    }

    range(): Interval {
        return Interval.INFINITE;
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsMapped(visitor.apply(this.input), this.func);
    }
}

export const mathMaps: Record<string, (v: number) => number> = {
    'acos': Math.acos,
    'asin': Math.asin,
    'atan': Math.atan,
    'cbrt': Math.cbrt,
    'ceil': Math.ceil,
    'cos': Math.cos,
    'cosh': Math.cosh,
    'floor': Math.floor,
    'log2': Math.log2,
    'log2_floor': (v: number) => Math.floor(Math.log2(v)),
    'ln': Math.log,
    'negate': (v: number) => -v,
    'round': Math.round,
    'sigmoid': (v: number) => 1 / (1 + Math.exp(-v)),
    'signum': Math.sign,
    'sin': Math.sin,
    'sinh': Math.sinh,
    'sqrt': Math.sqrt,
    'tan': Math.tan,
    'tanh': Math.tanh,
    'resolver': (v: number) => v,
};

//======// Clamp //===============================================================================//

export class MoredfsClamp extends DensityFunction {
    constructor(
        readonly input: DensityFunction,
        readonly minVal: number,
        readonly maxVal: number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return Math.max(this.minVal, Math.min(this.maxVal, this.input.compute(context)));
    }

    range(): Interval {
        return Interval.clamp(this.input.range(), this.minVal, this.maxVal);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsClamp(visitor.apply(this.input), this.minVal, this.maxVal);
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsClamp {
        return new MoredfsClamp(parser(obj.input), obj.min, obj.max);
    }
}

//======// Division & Modulo //===================================================================//

export class MoredfsDivisionBase extends DensityFunction {
    constructor(
        readonly arg1: DensityFunction,
        readonly arg2: DensityFunction,
        readonly func: (a: number, b: number) => number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return this.func(this.arg1.compute(context), this.arg2.compute(context));
    }

    range(): Interval {
        return Interval.INFINITE;
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsDivisionBase(visitor.apply(this.arg1), visitor.apply(this.arg2), this.func);
    }
}

export const divMaps: Record<string, (a: number, b: number) => number> = {
    'div': (a, b) => a / b,
    'floor_div': (a, b) => Math.floor(a / b),
    'floor_mod': (a, b) => ((a % b) + b) % b,
    'ieee_rem': (a, b) => a - Math.round(a / b) * b,
    'mod': (a, b) => a % b,
    'remainder': (a, b) => a % b,
};

export class MoredfsReciprocal extends DensityFunction {
    constructor(readonly input: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return 1.0 / this.input.compute(context);
    }

    range(): Interval {
        return Interval.reciprocal(this.input.range());
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsReciprocal(visitor.apply(this.input));
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsReciprocal {
        return new MoredfsReciprocal(parser(obj.denominator ?? obj.argument ?? obj.input));
    }
}

//======// Double Arguments //====================================================================//

export const doubleMaps: Record<string, (a: number, b: number) => number> = {
    'subtract': (a, b) => a - b,
    'vector_angle': (a, b) => Math.atan2(b, a),
    'power': (a, b) => Math.pow(a, b),
    'log': (a, b) => Math.log(a) / Math.log(b),
};

export class MoredfsDotProduct extends DensityFunction {
    constructor(
        readonly arg1: DensityFunction,
        readonly arg2: DensityFunction,
        readonly stepX: number,
        readonly stepY: number,
        readonly stepZ: number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        return this.arg1.compute(context) * this.arg2.compute(context);
    }

    range(): Interval {
        return Interval.INFINITE;
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsDotProduct(visitor.apply(this.arg1), visitor.apply(this.arg2), this.stepX, this.stepY, this.stepZ);
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsDotProduct {
        return new MoredfsDotProduct(parser(obj.argument1 ?? obj.left), parser(obj.argument2 ?? obj.right), obj.step_x ?? 1, obj.step_y ?? 1, obj.step_z ?? 1);
    }
}

//======// Coordinate Functions //================================================================//

export class MoredfsCoord extends DensityFunction {
    constructor(readonly type: 'x' | 'y' | 'z' | 'radius' | 'radius_3d' | 'polar_coords') {
        super();
    }

    compute(context: DensityFunction.Context): number {
        if (this.type === 'x') return context.x;
        if (this.type === 'y') return context.y;
        if (this.type === 'z') return context.z;
        if (this.type === 'radius') return Math.sqrt(context.x * context.x + context.z * context.z);
        if (this.type === 'radius_3d') return Math.sqrt(context.x * context.x + context.y * context.y + context.z * context.z);
        if (this.type === 'polar_coords') return Math.atan2(context.z, context.x);
        return 0;
    }

    range(): Interval {
        return Interval.INFINITE;
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static createParser(type: 'x' | 'y' | 'z' | 'radius' | 'radius_3d' | 'polar_coords') {
        return () => new MoredfsCoord(type);
    }
}

//======// Distance //============================================================================//

export class MoredfsDistance extends DensityFunction {
    constructor(
        readonly metric: string,
        readonly p1: DensityFunction[],
        readonly p2: DensityFunction[]
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const len = Math.max(this.p1.length, this.p2.length);
        if (len === 1) {
            return Math.abs((this.p2[0]?.compute(context) ?? 0) - (this.p1[0]?.compute(context) ?? 0));
        }
        if (this.metric === 'manhattan') {
            let sum = 0;
            for (let i = 0; i < len; i++) sum += Math.abs((this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0));
            return sum;
        }
        if (this.metric === 'euclidean') {
            let sum = 0;
            for (let i = 0; i < len; i++) {
                const diff = (this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0);
                sum += diff * diff;
            }
            return Math.sqrt(sum);
        }
        if (this.metric === 'chebyshev') {
            let max = 0;
            for (let i = 0; i < len; i++) {
                const diff = Math.abs((this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0));
                if (diff > max) max = diff;
            }
            return max;
        }
        if (this.metric.startsWith('minkowski')) {
            const p = parseFloat(this.metric.split('_')[1] || '1');
            let sum = 0;
            for (let i = 0; i < len; i++) sum += Math.pow(Math.abs((this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0)), p);
            return Math.pow(sum, 1.0 / p);
        }
        return 0;
    }

    range(): Interval {
        return Interval.of(0, Infinity);
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsDistance(
            this.metric,
            this.p1.map(p => visitor.apply(p)),
            this.p2.map(p => visitor.apply(p))
        );
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsDistance {
        return new MoredfsDistance(
            obj.distance_metric?.type?.replace('moredfs:', '') || 'euclidean',
            (obj.point1 || []).map(parser),
            (obj.point2 || []).map(parser)
        );
    }
}

//======// Derivative & Gradient Magnitude //=====================================================//

export class MoredfsDerivative extends DensityFunction {
    constructor(
        readonly argument: DensityFunction,
        readonly compX: { direction: DensityFunction; step: number } | null,
        readonly compY: { direction: DensityFunction; step: number } | null,
        readonly compZ: { direction: DensityFunction; step: number } | null
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        let dirX = 0, dirY = 0, dirZ = 0;
        let gradX = 0, gradY = 0, gradZ = 0;

        if (this.compX) {
            dirX = this.compX.direction.compute(context);
            const step = this.compX.step;
            gradX = (this.argument.compute({ ...context, x: context.x + step }) - this.argument.compute({ ...context, x: context.x - step })) / (2 * step);
        }
        if (this.compY) {
            dirY = this.compY.direction.compute(context);
            const step = this.compY.step;
            gradY = (this.argument.compute({ ...context, y: context.y + step }) - this.argument.compute({ ...context, y: context.y - step })) / (2 * step);
        }
        if (this.compZ) {
            dirZ = this.compZ.direction.compute(context);
            const step = this.compZ.step;
            gradZ = (this.argument.compute({ ...context, z: context.z + step }) - this.argument.compute({ ...context, z: context.z - step })) / (2 * step);
        }

        const mag = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;
        return gradX * (dirX / mag) + gradY * (dirY / mag) + gradZ * (dirZ / mag);
    }

    range(): Interval { return Interval.INFINITE; }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsDerivative(
            visitor.apply(this.argument),
            this.compX ? { direction: visitor.apply(this.compX.direction), step: this.compX.step } : null,
            this.compY ? { direction: visitor.apply(this.compY.direction), step: this.compY.step } : null,
            this.compZ ? { direction: visitor.apply(this.compZ.direction), step: this.compZ.step } : null
        );
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsDerivative {
        return new MoredfsDerivative(
            parser(obj.argument ?? obj.input),
            obj.component_x ? { direction: parser(obj.component_x.direction), step: obj.component_x.step } : null,
            obj.component_y ? { direction: parser(obj.component_y.direction), step: obj.component_y.step } : null,
            obj.component_z ? { direction: parser(obj.component_z.direction), step: obj.component_z.step } : null
        );
    }
}

export class MoredfsGradientMagnitude extends DensityFunction {
    constructor(
        readonly argument: DensityFunction,
        readonly stepX: number,
        readonly stepY: number,
        readonly stepZ: number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        let gradX = 0, gradY = 0, gradZ = 0;
        if (this.stepX) gradX = (this.argument.compute({ ...context, x: context.x + this.stepX }) - this.argument.compute({ ...context, x: context.x - this.stepX })) / (2 * this.stepX);
        if (this.stepY) gradY = (this.argument.compute({ ...context, y: context.y + this.stepY }) - this.argument.compute({ ...context, y: context.y - this.stepY })) / (2 * this.stepY);
        if (this.stepZ) gradZ = (this.argument.compute({ ...context, z: context.z + this.stepZ }) - this.argument.compute({ ...context, z: context.z - this.stepZ })) / (2 * this.stepZ);
        return Math.sqrt(gradX * gradX + gradY * gradY + gradZ * gradZ);
    }

    range(): Interval { return Interval.of(0, Infinity); }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsGradientMagnitude(visitor.apply(this.argument), this.stepX, this.stepY, this.stepZ);
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsGradientMagnitude {
        return new MoredfsGradientMagnitude(parser(obj.argument ?? obj.input), obj.step_x ?? 1, obj.step_y ?? 1, obj.step_z ?? 1);
    }
}

//======// OrElse & Shift //======================================================================//

export class MoredfsOrElse extends DensityFunction {
    constructor(readonly argument: DensityFunction, readonly fallback: DensityFunction) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const val = this.argument.compute(context);
        return (isNaN(val) || !isFinite(val)) ? this.fallback.compute(context) : val;
    }

    range(): Interval {
        return Interval.encapsulating(this.argument.range(), this.fallback.range());
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsOrElse(visitor.apply(this.argument), visitor.apply(this.fallback));
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsOrElse {
        return new MoredfsOrElse(parser(obj.argument ?? obj.input), parser(obj.fallback));
    }
}

export class MoredfsShift extends DensityFunction {
    constructor(
        readonly argument: DensityFunction,
        readonly shiftX: DensityFunction | null,
        readonly shiftY: DensityFunction | null,
        readonly shiftZ: DensityFunction | null
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const sx = this.shiftX ? this.shiftX.compute(context) : 0;
        const sy = this.shiftY ? this.shiftY.compute(context) : 0;
        const sz = this.shiftZ ? this.shiftZ.compute(context) : 0;
        return this.argument.compute({ x: context.x + sx, y: context.y + sy, z: context.z + sz });
    }

    range(): Interval {
        return this.argument.range();
    }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsShift(
            visitor.apply(this.argument),
            this.shiftX ? visitor.apply(this.shiftX) : null,
            this.shiftY ? visitor.apply(this.shiftY) : null,
            this.shiftZ ? visitor.apply(this.shiftZ) : null
        );
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsShift {
        return new MoredfsShift(
            parser(obj.argument ?? obj.input),
            obj.shift_x ? parser(obj.shift_x) : null,
            obj.shift_y ? parser(obj.shift_y) : null,
            obj.shift_z ? parser(obj.shift_z) : null
        );
    }
}

//======// Value Noise //=========================================================================//

export class MoredfsValueNoise extends DensityFunction {
    readonly samplerMin: number;
    readonly samplerMax: number;

    constructor(
        readonly sizeX: number,
        readonly sizeY: number,
        readonly sizeZ: number,
        readonly interp: string,
        readonly salt: number,
        sampler: any
    ) {
        super();
        this.samplerMin = sampler?.min ?? 0;
        this.samplerMax = sampler?.max ?? 1;
    }

    private hash(x: number, y: number, z: number): number {
        let h = Math.imul(x, 3129871) ^ Math.imul(y, 1161293) ^ Math.imul(z, 7919) ^ this.salt;
        h = Math.imul(h ^ (h >>> 13), 2654435761);
        h = (h ^ (h >>> 16));
        return (h >>> 0) / 4294967295.0;
    }

    compute(context: DensityFunction.Context): number {
        const px = this.sizeX > 0 ? context.x / this.sizeX : 0;
        const py = this.sizeY > 0 ? context.y / this.sizeY : 0;
        const pz = this.sizeZ > 0 ? context.z / this.sizeZ : 0;

        const x0 = Math.floor(px);
        const y0 = Math.floor(py);
        const z0 = Math.floor(pz);

        let val = 0;
        if (this.interp === 'none') {
            val = this.hash(x0, y0, z0);
        } else {
            let tx = px - x0;
            let ty = py - y0;
            let tz = pz - z0;
            if (this.interp === 'smoothstep') {
                tx = tx * tx * (3.0 - 2.0 * tx);
                ty = ty * ty * (3.0 - 2.0 * ty);
                tz = tz * tz * (3.0 - 2.0 * tz);
            }

            const c000 = this.hash(x0, y0, z0);
            const c100 = this.hash(x0 + 1, y0, z0);
            const c010 = this.hash(x0, y0 + 1, z0);
            const c110 = this.hash(x0 + 1, y0 + 1, z0);
            const c001 = this.hash(x0, y0, z0 + 1);
            const c101 = this.hash(x0 + 1, y0, z0 + 1);
            const c011 = this.hash(x0, y0 + 1, z0 + 1);
            const c111 = this.hash(x0 + 1, y0 + 1, z0 + 1);

            const c00 = c000 + tx * (c100 - c000);
            const c10 = c010 + tx * (c110 - c010);
            const c01 = c001 + tx * (c101 - c001);
            const c11 = c011 + tx * (c111 - c011);

            const c0 = c00 + ty * (c10 - c00);
            const c1 = c01 + ty * (c11 - c01);

            val = c0 + tz * (c1 - c0);
        }
        return this.samplerMin + val * (this.samplerMax - this.samplerMin);
    }

    range(): Interval { return Interval.of(this.samplerMin, this.samplerMax); }
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction { return this; }

    static fromJson(obj: any): MoredfsValueNoise {
        return new MoredfsValueNoise(
            obj.size_x ?? 1,
            obj.size_y ?? 1,
            obj.size_z ?? 1,
            obj.interpolation ?? 'none',
            obj.salt ?? 0,
            obj.sampler
        );
    }
}

//======// Image Tessellation //==================================================================//

export class MoredfsImageTessellation extends DensityFunction {
    readonly data: Uint8Array | null = null;

    constructor(readonly xSize: number, readonly zSize: number, b64Data: string) {
        super();
        if (b64Data) {
            try {
                const binString = atob(b64Data);
                const bytes = new Uint8Array(binString.length);
                for (let i = 0; i < binString.length; i++) bytes[i] = binString.charCodeAt(i);
                this.data = pako.inflate(bytes);
            } catch (e) {
                console.error("Failed to inflate moredfs image tessellation data:", e);
            }
        }
    }

    compute(context: DensityFunction.Context): number {
        if (!this.data) return 0;
        let x = context.x % this.xSize;
        if (x < 0) x += this.xSize;
        let z = context.z % this.zSize;
        if (z < 0) z += this.zSize;
        const idx = Math.floor(x) + Math.floor(z) * this.xSize;
        if (idx >= 0 && idx < this.data.length) return this.data[idx];
        return 0;
    }

    range(): Interval { return Interval.of(0, 255); }
    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction { return this; }

    static fromJson(obj: any): MoredfsImageTessellation {
        return new MoredfsImageTessellation(obj.x_size, obj.z_size, obj.deflated_frame_data);
    }
}

//======// Spiral & Gradient //===================================================================//

export class MoredfsGappedSpiral extends DensityFunction {
    constructor(
        readonly xSize: number,
        readonly zSize: number,
        readonly spacing: number,
        readonly gridCellArgs: DensityFunction[],
        readonly oobArg: DensityFunction
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const gridX = Math.floor(context.x / this.xSize);
        const gridZ = Math.floor(context.z / this.zSize);
        if (gridX % this.spacing !== 0 || gridZ % this.spacing !== 0) return this.oobArg.compute(context);

        const nx = gridX / this.spacing;
        const nz = gridZ / this.spacing;
        const ring = Math.max(Math.abs(nx), Math.abs(nz));

        if (ring === 0) return this.gridCellArgs.length > 0 ? this.gridCellArgs[0].compute(context) : this.oobArg.compute(context);

        let index = 1 + 4 * ring * (ring - 1);
        if (nx === ring && nz !== ring) {
            index += (ring - 1 - nz);
        } else if (nz === -ring) {
            index += (2 * ring) + (ring - 1 - nx);
        } else if (nx === -ring) {
            index += (4 * ring) + (nz + ring - 1);
        } else {
            index += (6 * ring) + (nx + ring - 1);
        }

        if (index >= 0 && index < this.gridCellArgs.length) return this.gridCellArgs[index].compute(context);
        return this.oobArg.compute(context);
    }

    range(): Interval { return Interval.INFINITE; }

    mapChildren(visitor: DensityFunction.Visitor): DensityFunction {
        return new MoredfsGappedSpiral(
            this.xSize,
            this.zSize,
            this.spacing,
            this.gridCellArgs.map(a => visitor.apply(a)),
            visitor.apply(this.oobArg)
        );
    }

    static fromJson(obj: any, parser: InputParser = DensityFunction.fromJson): MoredfsGappedSpiral {
        return new MoredfsGappedSpiral(
            obj.x_size,
            obj.z_size,
            obj.spacing,
            (obj.grid_cell_args || []).map(parser),
            parser(obj.out_of_bounds_argument)
        );
    }
}

export class MoredfsClampedGradient extends DensityFunction {
    constructor(
        readonly axis: 'x' | 'z',
        readonly from: number,
        readonly to: number,
        readonly fromV: number,
        readonly toV: number
    ) {
        super();
    }

    compute(context: DensityFunction.Context): number {
        const val = this.axis === 'x' ? context.x : context.z;
        return clampedMap(val, this.from, this.to, this.fromV, this.toV);
    }

    range(): Interval {
        return Interval.of(Math.min(this.fromV, this.toV), Math.max(this.fromV, this.toV));
    }

    mapChildren(_visitor: DensityFunction.Visitor): DensityFunction {
        return this;
    }

    static createParser(axis: 'x' | 'z') {
        return (obj: any) => new MoredfsClampedGradient(
            axis,
            axis === 'x' ? obj.from_x : obj.from_z,
            axis === 'x' ? obj.to_x : obj.to_z,
            obj.from_value,
            obj.to_value
        );
    }
}
