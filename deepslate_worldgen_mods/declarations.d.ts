declare module 'fastnoise-lite' {
    export default class FastNoiseLite {
        static NoiseType: any;
        static CellularDistanceFunction: any;
        static CellularReturnType: any;
        static FractalType: any;
        constructor(seed?: number);
        [key: string]: any;
    }
}

declare module 'node:test' {
    const test: (name: string, fn: () => void | Promise<void>) => void;
    export default test;
}

declare module 'node:assert/strict' {
    const assert: any;
    export default assert;
}
