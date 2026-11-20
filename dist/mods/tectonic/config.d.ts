export interface TectonicNoiseState {
    scale: number;
    multiplier: number;
    offset: number;
    smootherScaling: boolean;
}
export type TectonicPresetName = 'default' | 'large_biomes' | 'deserted' | 'frozen_wasteland' | 'overkill';
export declare const TECTONIC_DEFAULT_CONSTANTS: Record<string, number>;
export declare const TECTONIC_DEFAULT_NOISE_STATES: Record<string, TectonicNoiseState>;
export declare const TECTONIC_PRESETS: Record<TectonicPresetName, {
    constants?: Partial<Record<string, number>>;
    noise?: Partial<Record<string, Partial<TectonicNoiseState>>>;
}>;
export declare class TectonicConfigRegistry {
    private readonly constants;
    private readonly noiseStates;
    constructor();
    reset(): void;
    getConstant(key: string): number;
    setConstant(key: string, value: number): void;
    setConstants(constants: Record<string, number>): void;
    getNoiseState(key: string): TectonicNoiseState;
    setNoiseState(key: string, state: Partial<TectonicNoiseState>): void;
    applyPreset(presetName: TectonicPresetName): void;
}
export declare const TECTONIC_CONFIG: TectonicConfigRegistry;
//# sourceMappingURL=config.d.ts.map