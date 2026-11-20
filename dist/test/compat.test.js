import test from 'node:test';
import assert from 'node:assert/strict';
import { DensityFunction } from 'deepslate';
import { IntervalPolyfill, Interval, parseInput, parseLeft, parseRight } from '../compat/index.js';
import { LithostitchedSqrt, LithostitchedMix, LithostitchedAxis } from '../mods/lithostitched/lib.js';
import { LarionDivision, LarionXCoord } from '../mods/larion/lib.js';
import { TectonicConfigClamp, TectonicConfigConstant, TectonicInvert } from '../mods/tectonic/lib.js';
import { MoredfsClamp, MoredfsMapped, MoredfsClampedGradient, mathMaps } from '../mods/moredfs/lib.js';
import { SeededVisitor } from '../mods/ikblibrary/density-functions.js';
import { registerAll, ALL_DENSITY_FUNCTIONS } from '../index.js';
test('1. IntervalPolyfill provides complete math and range contract', () => {
    const poly = IntervalPolyfill.of(-5, 10);
    assert.equal(poly.min, -5);
    assert.equal(poly.max, 10);
    assert.equal(poly.contains(0), true);
    assert.equal(poly.contains(-10), false);
    assert.equal(poly.contains(15), false);
    assert.equal(poly.isNaI(), false);
    const clamped = IntervalPolyfill.clamp(poly, -2, 4);
    assert.equal(clamped.min, -2);
    assert.equal(clamped.max, 4);
    const exact = IntervalPolyfill.ofExact(7);
    assert.equal(exact.min, 7);
    assert.equal(exact.max, 7);
    const symmetric = IntervalPolyfill.ofSymmetric(3);
    assert.equal(symmetric.min, -3);
    assert.equal(symmetric.max, 3);
    const encap = IntervalPolyfill.encapsulating(IntervalPolyfill.of(1, 4), IntervalPolyfill.of(-3, 2));
    assert.equal(encap.min, -3);
    assert.equal(encap.max, 4);
    const recip = IntervalPolyfill.reciprocal(IntervalPolyfill.of(2, 4));
    assert.equal(recip.min, 0.25);
    assert.equal(recip.max, 0.5);
    const recipZeroCross = IntervalPolyfill.reciprocal(IntervalPolyfill.of(-2, 4));
    assert.equal(recipZeroCross.min, -Infinity);
    assert.equal(recipZeroCross.max, Infinity);
    assert.equal(IntervalPolyfill.INFINITE.min, -Infinity);
    assert.equal(IntervalPolyfill.INFINITE.max, Infinity);
    assert.equal(IntervalPolyfill.NaI.isNaI(), true);
    // Exported Interval contract matches
    assert.ok(Interval.of);
    assert.ok(Interval.ofExact);
    assert.ok(Interval.INFINITE);
});
test('2. Tolerant JSON parsing helpers handle 0.23.6 and 0.27+ field names', () => {
    // Unary input / argument
    assert.equal(parseInput({ input: 'val_input' }), 'val_input');
    assert.equal(parseInput({ argument: 'val_arg' }), 'val_arg');
    assert.equal(parseInput({ input: 'both_in', argument: 'both_arg' }), 'both_in');
    // Binary left / argument1 / dividend
    assert.equal(parseLeft({ left: 'l' }), 'l');
    assert.equal(parseLeft({ argument1: 'arg1' }), 'arg1');
    assert.equal(parseLeft({ dividend: 'div' }), 'div');
    // Binary right / argument2 / divisor
    assert.equal(parseRight({ right: 'r' }), 'r');
    assert.equal(parseRight({ argument2: 'arg2' }), 'arg2');
    assert.equal(parseRight({ divisor: 'div' }), 'div');
    // Mod fromJson tolerance
    const sqrtOld = LithostitchedSqrt.fromJson({ type: 'lithostitched:sqrt', argument: { type: 'minecraft:constant', value: 16 } });
    const sqrtNew = LithostitchedSqrt.fromJson({ type: 'lithostitched:sqrt', input: { type: 'minecraft:constant', value: 16 } });
    assert.equal(sqrtOld.compute({ x: 0, y: 0, z: 0 }), 4);
    assert.equal(sqrtNew.compute({ x: 0, y: 0, z: 0 }), 4);
    const divOld = LarionDivision.fromJson({ type: 'larion:div', argument1: { type: 'minecraft:constant', value: 20 }, argument2: { type: 'minecraft:constant', value: 4 } });
    const divNew = LarionDivision.fromJson({ type: 'larion:div', left: { type: 'minecraft:constant', value: 20 }, right: { type: 'minecraft:constant', value: 4 } });
    assert.equal(divOld.compute({ x: 0, y: 0, z: 0 }), 5);
    assert.equal(divNew.compute({ x: 0, y: 0, z: 0 }), 5);
});
test('3. SeededVisitor provides dual-interface (.apply and .map)', () => {
    const visitor = new SeededVisitor(12345n);
    assert.equal(typeof visitor.apply, 'function');
    assert.equal(typeof visitor.map, 'function');
    assert.equal(visitor.apply, visitor.map);
});
test('4. Dual-Interface on CompatDensityFunction: range(), minValue(), maxValue()', () => {
    const constant16 = new DensityFunction.Constant(16);
    const sqrt = new LithostitchedSqrt(constant16);
    // 0.27+ / 0.26+ range()
    const r = sqrt.range();
    assert.equal(r.min, 4);
    assert.equal(r.max, 4);
    // 0.23.6 minValue() & maxValue()
    assert.equal(sqrt.minValue(), 4);
    assert.equal(sqrt.maxValue(), 4);
});
test('5. mapAll traversal compatibility in 0.27+ and 0.23.6 modes', () => {
    const c1 = new DensityFunction.Constant(10);
    const c2 = new DensityFunction.Constant(2);
    const div = new LarionDivision(c1, c2);
    // 1. 0.27+ Visitor (apply method)
    const visited27 = [];
    const visitor27 = {
        apply: (fn) => {
            visited27.push(fn);
            return fn;
        }
    };
    const mapped27 = div.mapAll(visitor27);
    assert.ok(mapped27);
    // In 0.27 super.mapAll: post-order visits children, then root
    assert.ok(visited27.length >= 3);
    assert.ok(visited27.includes(c1));
    assert.ok(visited27.includes(c2));
    // 2. 0.23.6 Visitor (map method only, no apply method)
    const visited23 = [];
    const visitor23 = {
        map: (fn) => {
            visited23.push(fn);
            if (fn === c2) {
                // Replace c2 (2) with 5
                return new DensityFunction.Constant(5);
            }
            return fn;
        }
    };
    const mapped23 = div.mapAll(visitor23);
    assert.ok(mapped23);
    assert.ok(visited23.length >= 3);
    assert.ok(visited23.includes(c1));
    assert.ok(visited23.includes(c2));
    // After replacement: 10 / 5 = 2 (instead of 10 / 2 = 5)
    assert.equal(div.compute({ x: 0, y: 0, z: 0 }), 5);
    assert.equal(mapped23.compute({ x: 0, y: 0, z: 0 }), 2);
});
test('6. Complex Multi-Mod Density Function verified across all target eras (0.27.x, 0.26.2, 0.23.6)', () => {
    // Build a deeply nested, multi-mod worldgen density function tree:
    //
    // clamp(min: -10, max: 10,
    //   input: larion:div(
    //     left: lithostitched:mix(
    //       input: moredfs:sin(lithostitched:axis('x')),
    //       left: tectonic:config_clamp(
    //         input: moredfs:x_clamped_gradient(axis: 'x', from_x: 0, to_x: 100, from_value: 0, to_value: 10),
    //         min: tectonic:config_constant('min_y'),     // -64
    //         max: tectonic:config_constant('max_y')      // 320
    //       ),
    //       right: lithostitched:sqrt(
    //         input: moredfs:abs(larion:x())
    //       )
    //     ),
    //     right: tectonic:invert(
    //       input: moredfs:square(tectonic:config_constant('vertical_scale')) // 1.125
    //     )
    //   )
    // )
    const axisX = new LithostitchedAxis('x');
    const sinX = new MoredfsMapped(axisX, mathMaps['sin']);
    const gradient = new MoredfsClampedGradient('x', 0, 100, 0, 10);
    const minY = new TectonicConfigConstant('min_y', -64);
    const maxY = new TectonicConfigConstant('max_y', 320);
    const configClamp = new TectonicConfigClamp(gradient, minY, maxY);
    const xCoord = new LarionXCoord();
    const absX = new MoredfsMapped(xCoord, Math.abs);
    const sqrtAbsX = new LithostitchedSqrt(absX);
    const mix = new LithostitchedMix(sinX, configClamp, sqrtAbsX);
    const vertScale = new TectonicConfigConstant('vertical_scale', 2.0);
    const squareVertScale = new MoredfsMapped(vertScale, (v) => v * v); // 4.0
    const invertedScale = new TectonicInvert(squareVertScale, 0.25, 0.25); // 1.0 / 4.0 = 0.25
    const div = new LarionDivision(mix, invertedScale); // mix / 0.25 == mix * 4
    const root = new MoredfsClamp(div, -10, 10);
    // Context for testing: x = 50
    // gradient(50) = 5.0 -> clamped between -64 and 320 = 5.0
    // abs(50) = 50 -> sqrt(50) ~ 7.0710678
    // sin(50) = -0.2623748537
    // In LithostitchedMix: if input <= 0 -> returns arg1 (configClamp = 5.0)
    // div = 5.0 / 0.25 = 20.0
    // clamp(20.0, -10, 10) = 10.0
    const ctx = { x: 50, y: 0, z: 0 };
    const result = root.compute(ctx);
    assert.equal(result, 10.0);
    // Another context: x = 0
    // gradient(0) = 0.0 -> clamped = 0.0
    // abs(0) = 0 -> sqrt(0) = 0
    // sin(0) = 0 -> in LithostitchedMix: input <= 0 -> returns arg1 = 0.0
    // div = 0.0 / 0.25 = 0.0
    // clamp(0, -10, 10) = 0.0
    assert.equal(root.compute({ x: 0, y: 0, z: 0 }), 0.0);
    // === ERA 1: Deepslate 0.27.x Validation ===
    // 1. Range check via Interval
    const range = root.range();
    assert.equal(range.min, -10);
    assert.equal(range.max, 10);
    // 2. Traversal with 0.27.x Visitor (apply)
    let nodeCount27 = 0;
    const mappedTree27 = root.mapAll({
        apply: (node) => {
            nodeCount27++;
            return node;
        }
    });
    assert.ok(nodeCount27 >= 12, `Expected at least 12 nodes visited, got ${nodeCount27}`);
    assert.equal(mappedTree27.compute(ctx), 10.0);
    // === ERA 2: Deepslate 0.26.2 Validation ===
    // 1. Both range() and minValue()/maxValue() exist and match
    assert.equal(root.minValue(), -10);
    assert.equal(root.maxValue(), 10);
    assert.equal(root.range().min, root.minValue());
    assert.equal(root.range().max, root.maxValue());
    // === ERA 3: Deepslate 0.23.6 Validation ===
    // 1. No Interval export at runtime: IntervalPolyfill handles operations
    const simulatedPolyfillRange = IntervalPolyfill.clamp(IntervalPolyfill.of(-100, 100), -10, 10);
    assert.equal(simulatedPolyfillRange.min, -10);
    assert.equal(simulatedPolyfillRange.max, 10);
    // 2. 0.23.6 Traversal (only .map method)
    let nodeCount23 = 0;
    const mappedTree23 = root.mapAll({
        map: (node) => {
            nodeCount23++;
            // Dynamically alter a leaf node during 0.23.6 traversal:
            // Replace vertScale (2.0) with vertScale (1.0)
            if (node === vertScale) {
                return new TectonicConfigConstant('vertical_scale', 1.0);
            }
            return node;
        }
    });
    assert.equal(nodeCount23, nodeCount27, 'Node counts between 0.27 and 0.23.6 traversals must match');
    // With vertical_scale = 1.0 -> square = 1.0 -> inverted = 1.0 -> div = 5.0 / 1.0 = 5.0 -> clamp(5.0) = 5.0
    assert.equal(mappedTree23.compute(ctx), 5.0);
});
test('7. registerAll registers all density functions correctly', () => {
    const mockRegistry = new Map();
    registerAll(mockRegistry);
    assert.ok(mockRegistry.has('lithostitched:sqrt'));
    assert.ok(mockRegistry.has('moredfs:clamp'));
    assert.ok(mockRegistry.has('tectonic:config_clamp'));
    assert.ok(mockRegistry.has('ikblibrary:voronoi'));
    assert.ok(mockRegistry.has('larion:div'));
    assert.ok(mockRegistry.has('msg:lonely_island'));
    assert.equal(mockRegistry.size, Object.keys(ALL_DENSITY_FUNCTIONS).length);
});
//# sourceMappingURL=compat.test.js.map