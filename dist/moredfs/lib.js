import { DensityFunction, Interval } from 'deepslate';
import pako from 'pako';
// Helper Math
function clampedMap(val, inMin, inMax, outMin, outMax) {
    if (val <= inMin)
        return outMin;
    if (val >= inMax)
        return outMax;
    return outMin + (outMax - outMin) * ((val - inMin) / (inMax - inMin));
}
//======// Math Maps //===========================================================================//
export class MoredfsMapped extends DensityFunction {
    input;
    func;
    constructor(input, func) {
        super();
        this.input = input;
        this.func = func;
    }
    compute(context) {
        return this.func(this.input.compute(context));
    }
    range() {
        return Interval.INFINITE;
    }
    mapChildren(visitor) {
        return new MoredfsMapped(visitor.apply(this.input), this.func);
    }
}
export const mathMaps = {
    'acos': Math.acos,
    'asin': Math.asin,
    'atan': Math.atan,
    'cbrt': Math.cbrt,
    'ceil': Math.ceil,
    'cos': Math.cos,
    'cosh': Math.cosh,
    'floor': Math.floor,
    'log2': Math.log2,
    'log2_floor': (v) => Math.floor(Math.log2(v)),
    'ln': Math.log,
    'negate': (v) => -v,
    'round': Math.round,
    'sigmoid': (v) => 1 / (1 + Math.exp(-v)),
    'signum': Math.sign,
    'sin': Math.sin,
    'sinh': Math.sinh,
    'sqrt': Math.sqrt,
    'tan': Math.tan,
    'tanh': Math.tanh,
    'resolver': (v) => v,
};
//======// Clamp //===============================================================================//
export class MoredfsClamp extends DensityFunction {
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
        return Math.max(this.minVal, Math.min(this.maxVal, this.input.compute(context)));
    }
    range() {
        return Interval.clamp(this.input.range(), this.minVal, this.maxVal);
    }
    mapChildren(visitor) {
        return new MoredfsClamp(visitor.apply(this.input), this.minVal, this.maxVal);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsClamp(parser(obj.input), obj.min, obj.max);
    }
}
//======// Division & Modulo //===================================================================//
export class MoredfsDivisionBase extends DensityFunction {
    arg1;
    arg2;
    func;
    constructor(arg1, arg2, func) {
        super();
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.func = func;
    }
    compute(context) {
        return this.func(this.arg1.compute(context), this.arg2.compute(context));
    }
    range() {
        return Interval.INFINITE;
    }
    mapChildren(visitor) {
        return new MoredfsDivisionBase(visitor.apply(this.arg1), visitor.apply(this.arg2), this.func);
    }
}
export const divMaps = {
    'div': (a, b) => a / b,
    'floor_div': (a, b) => Math.floor(a / b),
    'floor_mod': (a, b) => ((a % b) + b) % b,
    'ieee_rem': (a, b) => a - Math.round(a / b) * b,
    'mod': (a, b) => a % b,
    'remainder': (a, b) => a % b,
};
export class MoredfsReciprocal extends DensityFunction {
    input;
    constructor(input) {
        super();
        this.input = input;
    }
    compute(context) {
        return 1.0 / this.input.compute(context);
    }
    range() {
        return Interval.reciprocal(this.input.range());
    }
    mapChildren(visitor) {
        return new MoredfsReciprocal(visitor.apply(this.input));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsReciprocal(parser(obj.denominator ?? obj.argument ?? obj.input));
    }
}
//======// Double Arguments //====================================================================//
export const doubleMaps = {
    'subtract': (a, b) => a - b,
    'vector_angle': (a, b) => Math.atan2(b, a),
    'power': (a, b) => Math.pow(a, b),
    'log': (a, b) => Math.log(a) / Math.log(b),
};
export class MoredfsDotProduct extends DensityFunction {
    arg1;
    arg2;
    stepX;
    stepY;
    stepZ;
    constructor(arg1, arg2, stepX, stepY, stepZ) {
        super();
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.stepX = stepX;
        this.stepY = stepY;
        this.stepZ = stepZ;
    }
    compute(context) {
        return this.arg1.compute(context) * this.arg2.compute(context);
    }
    range() {
        return Interval.INFINITE;
    }
    mapChildren(visitor) {
        return new MoredfsDotProduct(visitor.apply(this.arg1), visitor.apply(this.arg2), this.stepX, this.stepY, this.stepZ);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsDotProduct(parser(obj.argument1 ?? obj.left), parser(obj.argument2 ?? obj.right), obj.step_x ?? 1, obj.step_y ?? 1, obj.step_z ?? 1);
    }
}
//======// Coordinate Functions //================================================================//
export class MoredfsCoord extends DensityFunction {
    type;
    constructor(type) {
        super();
        this.type = type;
    }
    compute(context) {
        if (this.type === 'x')
            return context.x;
        if (this.type === 'y')
            return context.y;
        if (this.type === 'z')
            return context.z;
        if (this.type === 'radius')
            return Math.sqrt(context.x * context.x + context.z * context.z);
        if (this.type === 'radius_3d')
            return Math.sqrt(context.x * context.x + context.y * context.y + context.z * context.z);
        if (this.type === 'polar_coords')
            return Math.atan2(context.z, context.x);
        return 0;
    }
    range() {
        return Interval.INFINITE;
    }
    mapChildren(_visitor) {
        return this;
    }
    static createParser(type) {
        return () => new MoredfsCoord(type);
    }
}
//======// Distance //============================================================================//
export class MoredfsDistance extends DensityFunction {
    metric;
    p1;
    p2;
    constructor(metric, p1, p2) {
        super();
        this.metric = metric;
        this.p1 = p1;
        this.p2 = p2;
    }
    compute(context) {
        const len = Math.max(this.p1.length, this.p2.length);
        if (len === 1) {
            return Math.abs((this.p2[0]?.compute(context) ?? 0) - (this.p1[0]?.compute(context) ?? 0));
        }
        if (this.metric === 'manhattan') {
            let sum = 0;
            for (let i = 0; i < len; i++)
                sum += Math.abs((this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0));
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
                if (diff > max)
                    max = diff;
            }
            return max;
        }
        if (this.metric.startsWith('minkowski')) {
            const p = parseFloat(this.metric.split('_')[1] || '1');
            let sum = 0;
            for (let i = 0; i < len; i++)
                sum += Math.pow(Math.abs((this.p2[i]?.compute(context) ?? 0) - (this.p1[i]?.compute(context) ?? 0)), p);
            return Math.pow(sum, 1.0 / p);
        }
        return 0;
    }
    range() {
        return Interval.of(0, Infinity);
    }
    mapChildren(visitor) {
        return new MoredfsDistance(this.metric, this.p1.map(p => visitor.apply(p)), this.p2.map(p => visitor.apply(p)));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsDistance(obj.distance_metric?.type?.replace('moredfs:', '') || 'euclidean', (obj.point1 || []).map(parser), (obj.point2 || []).map(parser));
    }
}
//======// Derivative & Gradient Magnitude //=====================================================//
export class MoredfsDerivative extends DensityFunction {
    argument;
    compX;
    compY;
    compZ;
    constructor(argument, compX, compY, compZ) {
        super();
        this.argument = argument;
        this.compX = compX;
        this.compY = compY;
        this.compZ = compZ;
    }
    compute(context) {
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
    range() { return Interval.INFINITE; }
    mapChildren(visitor) {
        return new MoredfsDerivative(visitor.apply(this.argument), this.compX ? { direction: visitor.apply(this.compX.direction), step: this.compX.step } : null, this.compY ? { direction: visitor.apply(this.compY.direction), step: this.compY.step } : null, this.compZ ? { direction: visitor.apply(this.compZ.direction), step: this.compZ.step } : null);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsDerivative(parser(obj.argument ?? obj.input), obj.component_x ? { direction: parser(obj.component_x.direction), step: obj.component_x.step } : null, obj.component_y ? { direction: parser(obj.component_y.direction), step: obj.component_y.step } : null, obj.component_z ? { direction: parser(obj.component_z.direction), step: obj.component_z.step } : null);
    }
}
export class MoredfsGradientMagnitude extends DensityFunction {
    argument;
    stepX;
    stepY;
    stepZ;
    constructor(argument, stepX, stepY, stepZ) {
        super();
        this.argument = argument;
        this.stepX = stepX;
        this.stepY = stepY;
        this.stepZ = stepZ;
    }
    compute(context) {
        let gradX = 0, gradY = 0, gradZ = 0;
        if (this.stepX)
            gradX = (this.argument.compute({ ...context, x: context.x + this.stepX }) - this.argument.compute({ ...context, x: context.x - this.stepX })) / (2 * this.stepX);
        if (this.stepY)
            gradY = (this.argument.compute({ ...context, y: context.y + this.stepY }) - this.argument.compute({ ...context, y: context.y - this.stepY })) / (2 * this.stepY);
        if (this.stepZ)
            gradZ = (this.argument.compute({ ...context, z: context.z + this.stepZ }) - this.argument.compute({ ...context, z: context.z - this.stepZ })) / (2 * this.stepZ);
        return Math.sqrt(gradX * gradX + gradY * gradY + gradZ * gradZ);
    }
    range() { return Interval.of(0, Infinity); }
    mapChildren(visitor) {
        return new MoredfsGradientMagnitude(visitor.apply(this.argument), this.stepX, this.stepY, this.stepZ);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsGradientMagnitude(parser(obj.argument ?? obj.input), obj.step_x ?? 1, obj.step_y ?? 1, obj.step_z ?? 1);
    }
}
//======// OrElse & Shift //======================================================================//
export class MoredfsOrElse extends DensityFunction {
    argument;
    fallback;
    constructor(argument, fallback) {
        super();
        this.argument = argument;
        this.fallback = fallback;
    }
    compute(context) {
        const val = this.argument.compute(context);
        return (isNaN(val) || !isFinite(val)) ? this.fallback.compute(context) : val;
    }
    range() {
        return Interval.encapsulating(this.argument.range(), this.fallback.range());
    }
    mapChildren(visitor) {
        return new MoredfsOrElse(visitor.apply(this.argument), visitor.apply(this.fallback));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsOrElse(parser(obj.argument ?? obj.input), parser(obj.fallback));
    }
}
export class MoredfsShift extends DensityFunction {
    argument;
    shiftX;
    shiftY;
    shiftZ;
    constructor(argument, shiftX, shiftY, shiftZ) {
        super();
        this.argument = argument;
        this.shiftX = shiftX;
        this.shiftY = shiftY;
        this.shiftZ = shiftZ;
    }
    compute(context) {
        const sx = this.shiftX ? this.shiftX.compute(context) : 0;
        const sy = this.shiftY ? this.shiftY.compute(context) : 0;
        const sz = this.shiftZ ? this.shiftZ.compute(context) : 0;
        return this.argument.compute({ x: context.x + sx, y: context.y + sy, z: context.z + sz });
    }
    range() {
        return this.argument.range();
    }
    mapChildren(visitor) {
        return new MoredfsShift(visitor.apply(this.argument), this.shiftX ? visitor.apply(this.shiftX) : null, this.shiftY ? visitor.apply(this.shiftY) : null, this.shiftZ ? visitor.apply(this.shiftZ) : null);
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsShift(parser(obj.argument ?? obj.input), obj.shift_x ? parser(obj.shift_x) : null, obj.shift_y ? parser(obj.shift_y) : null, obj.shift_z ? parser(obj.shift_z) : null);
    }
}
//======// Value Noise //=========================================================================//
export class MoredfsValueNoise extends DensityFunction {
    sizeX;
    sizeY;
    sizeZ;
    interp;
    salt;
    samplerMin;
    samplerMax;
    constructor(sizeX, sizeY, sizeZ, interp, salt, sampler) {
        super();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.sizeZ = sizeZ;
        this.interp = interp;
        this.salt = salt;
        this.samplerMin = sampler?.min ?? 0;
        this.samplerMax = sampler?.max ?? 1;
    }
    hash(x, y, z) {
        let h = Math.imul(x, 3129871) ^ Math.imul(y, 1161293) ^ Math.imul(z, 7919) ^ this.salt;
        h = Math.imul(h ^ (h >>> 13), 2654435761);
        h = (h ^ (h >>> 16));
        return (h >>> 0) / 4294967295.0;
    }
    compute(context) {
        const px = this.sizeX > 0 ? context.x / this.sizeX : 0;
        const py = this.sizeY > 0 ? context.y / this.sizeY : 0;
        const pz = this.sizeZ > 0 ? context.z / this.sizeZ : 0;
        const x0 = Math.floor(px);
        const y0 = Math.floor(py);
        const z0 = Math.floor(pz);
        let val = 0;
        if (this.interp === 'none') {
            val = this.hash(x0, y0, z0);
        }
        else {
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
    range() { return Interval.of(this.samplerMin, this.samplerMax); }
    mapChildren(_visitor) { return this; }
    static fromJson(obj) {
        return new MoredfsValueNoise(obj.size_x ?? 1, obj.size_y ?? 1, obj.size_z ?? 1, obj.interpolation ?? 'none', obj.salt ?? 0, obj.sampler);
    }
}
//======// Image Tessellation //==================================================================//
export class MoredfsImageTessellation extends DensityFunction {
    xSize;
    zSize;
    data = null;
    constructor(xSize, zSize, b64Data) {
        super();
        this.xSize = xSize;
        this.zSize = zSize;
        if (b64Data) {
            try {
                const binString = atob(b64Data);
                const bytes = new Uint8Array(binString.length);
                for (let i = 0; i < binString.length; i++)
                    bytes[i] = binString.charCodeAt(i);
                this.data = pako.inflate(bytes);
            }
            catch (e) {
                console.error("Failed to inflate moredfs image tessellation data:", e);
            }
        }
    }
    compute(context) {
        if (!this.data)
            return 0;
        let x = context.x % this.xSize;
        if (x < 0)
            x += this.xSize;
        let z = context.z % this.zSize;
        if (z < 0)
            z += this.zSize;
        const idx = Math.floor(x) + Math.floor(z) * this.xSize;
        if (idx >= 0 && idx < this.data.length)
            return this.data[idx];
        return 0;
    }
    range() { return Interval.of(0, 255); }
    mapChildren(_visitor) { return this; }
    static fromJson(obj) {
        return new MoredfsImageTessellation(obj.x_size, obj.z_size, obj.deflated_frame_data);
    }
}
//======// Spiral & Gradient //===================================================================//
export class MoredfsGappedSpiral extends DensityFunction {
    xSize;
    zSize;
    spacing;
    gridCellArgs;
    oobArg;
    constructor(xSize, zSize, spacing, gridCellArgs, oobArg) {
        super();
        this.xSize = xSize;
        this.zSize = zSize;
        this.spacing = spacing;
        this.gridCellArgs = gridCellArgs;
        this.oobArg = oobArg;
    }
    compute(context) {
        const gridX = Math.floor(context.x / this.xSize);
        const gridZ = Math.floor(context.z / this.zSize);
        if (gridX % this.spacing !== 0 || gridZ % this.spacing !== 0)
            return this.oobArg.compute(context);
        const nx = gridX / this.spacing;
        const nz = gridZ / this.spacing;
        const ring = Math.max(Math.abs(nx), Math.abs(nz));
        if (ring === 0)
            return this.gridCellArgs.length > 0 ? this.gridCellArgs[0].compute(context) : this.oobArg.compute(context);
        let index = 1 + 4 * ring * (ring - 1);
        if (nx === ring && nz !== ring) {
            index += (ring - 1 - nz);
        }
        else if (nz === -ring) {
            index += (2 * ring) + (ring - 1 - nx);
        }
        else if (nx === -ring) {
            index += (4 * ring) + (nz + ring - 1);
        }
        else {
            index += (6 * ring) + (nx + ring - 1);
        }
        if (index >= 0 && index < this.gridCellArgs.length)
            return this.gridCellArgs[index].compute(context);
        return this.oobArg.compute(context);
    }
    range() { return Interval.INFINITE; }
    mapChildren(visitor) {
        return new MoredfsGappedSpiral(this.xSize, this.zSize, this.spacing, this.gridCellArgs.map(a => visitor.apply(a)), visitor.apply(this.oobArg));
    }
    static fromJson(obj, parser = DensityFunction.fromJson) {
        return new MoredfsGappedSpiral(obj.x_size, obj.z_size, obj.spacing, (obj.grid_cell_args || []).map(parser), parser(obj.out_of_bounds_argument));
    }
}
export class MoredfsClampedGradient extends DensityFunction {
    axis;
    from;
    to;
    fromV;
    toV;
    constructor(axis, from, to, fromV, toV) {
        super();
        this.axis = axis;
        this.from = from;
        this.to = to;
        this.fromV = fromV;
        this.toV = toV;
    }
    compute(context) {
        const val = this.axis === 'x' ? context.x : context.z;
        return clampedMap(val, this.from, this.to, this.fromV, this.toV);
    }
    range() {
        return Interval.of(Math.min(this.fromV, this.toV), Math.max(this.fromV, this.toV));
    }
    mapChildren(_visitor) {
        return this;
    }
    static createParser(axis) {
        return (obj) => new MoredfsClampedGradient(axis, axis === 'x' ? obj.from_x : obj.from_z, axis === 'x' ? obj.to_x : obj.to_z, obj.from_value, obj.to_value);
    }
}
//# sourceMappingURL=lib.js.map