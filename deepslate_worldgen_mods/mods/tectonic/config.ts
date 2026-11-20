export interface TectonicNoiseState {
    scale: number;
    multiplier: number;
    offset: number;
    smootherScaling: boolean;
}

export type TectonicPresetName = 'default' | 'large_biomes' | 'deserted' | 'frozen_wasteland' | 'overkill';

export const TECTONIC_DEFAULT_CONSTANTS: Record<string, number> = {
    vertical_scale: 1.125,
    elevation_boost: 0.0,
    min_y: -64,
    max_y: 320,
    lava_tunnels: 1,
    ocean_offset: -0.8,
    alternate_erosion_scale: 1.0,
    underground_rivers: -1,
    flat_terrain_skew: 0.1,
    rolling_hills: 1,
    jungle_pillars: 1,
    ocean_depth: -0.22,
    deep_ocean_depth: -0.45,
    depth_cutoff_start: 0.1,
    depth_cutoff_size: 0.1,
    cheese_enabled: 1,
    cheese_additive: 0.27,
    noodle_enabled: 1,
    noodle_additive: -0.075,
};

export const TECTONIC_DEFAULT_NOISE_STATES: Record<string, TectonicNoiseState> = {
    continents: { scale: 0.13, multiplier: 1.0, offset: 0.0, smootherScaling: false },
    island: { scale: 0.11, multiplier: 1.0, offset: 0.0, smootherScaling: false },
    erosion: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
    ridge: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
    temperature: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
    vegetation: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
};

export const TECTONIC_PRESETS: Record<TectonicPresetName, {
    constants?: Partial<Record<string, number>>;
    noise?: Partial<Record<string, Partial<TectonicNoiseState>>>;
}> = {
    default: {
        constants: {},
        noise: {},
    },
    large_biomes: {
        constants: {},
        noise: {
            temperature: { scale: 0.06, multiplier: 1.1, offset: 0.0, smootherScaling: false },
            vegetation: { scale: 0.06, multiplier: 1.1, offset: 0.0, smootherScaling: false },
        },
    },
    deserted: {
        constants: {},
        noise: {
            temperature: { scale: 0.0, multiplier: 0.0, offset: 1.0, smootherScaling: false },
            vegetation: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
        },
    },
    frozen_wasteland: {
        constants: {
            vertical_scale: 1.2,
            elevation_boost: 0.5,
            max_y: 448,
            ocean_offset: -0.8,
            flat_terrain_skew: 0.0,
        },
        noise: {
            continents: { scale: 0.13, multiplier: 1.0, offset: 0.0, smootherScaling: false },
            erosion: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
            ridge: { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false },
            temperature: { scale: 0.0, multiplier: 0.0, offset: -0.69, smootherScaling: false },
            vegetation: { scale: 0.15, multiplier: 0.1, offset: -0.1, smootherScaling: false },
        },
    },
    overkill: {
        constants: {
            vertical_scale: 2.5,
            elevation_boost: 1.6,
            max_y: 768,
            ocean_offset: -0.5,
            flat_terrain_skew: 0.5,
            lava_tunnels: 0,
            rolling_hills: 0,
            jungle_pillars: 0,
            underground_rivers: 0,
        },
        noise: {
            continents: { scale: 0.1, multiplier: 1.0, offset: 0.0, smootherScaling: true },
            erosion: { scale: 0.08, multiplier: 1.0, offset: 0.0, smootherScaling: true },
            ridge: { scale: 0.2, multiplier: 1.0, offset: 0.0, smootherScaling: false },
            temperature: { scale: 0.1, multiplier: 1.1, offset: 0.0, smootherScaling: false },
            vegetation: { scale: 0.1, multiplier: 1.1, offset: -0.2, smootherScaling: false },
        },
    },
};

export class TectonicConfigRegistry {
    private readonly constants = new Map<string, number>();
    private readonly noiseStates = new Map<string, TectonicNoiseState>();

    constructor() {
        this.reset();
    }

    reset(): void {
        this.constants.clear();
        for (const [key, value] of Object.entries(TECTONIC_DEFAULT_CONSTANTS)) {
            this.constants.set(key, value);
        }
        this.noiseStates.clear();
        for (const [key, state] of Object.entries(TECTONIC_DEFAULT_NOISE_STATES)) {
            this.noiseStates.set(key, { ...state });
        }
    }

    getConstant(key: string): number {
        return this.constants.get(key) ?? 0.0;
    }

    setConstant(key: string, value: number): void {
        this.constants.set(key, value);
    }

    setConstants(constants: Record<string, number>): void {
        for (const [key, value] of Object.entries(constants)) {
            this.setConstant(key, value);
        }
    }

    getNoiseState(key: string): TectonicNoiseState {
        const found = this.noiseStates.get(key);
        if (found) {
            return { ...found };
        }
        return { scale: 0.25, multiplier: 1.0, offset: 0.0, smootherScaling: false };
    }

    setNoiseState(key: string, state: Partial<TectonicNoiseState>): void {
        const existing = this.getNoiseState(key);
        this.noiseStates.set(key, { ...existing, ...state });
    }

    applyPreset(presetName: TectonicPresetName): void {
        const preset = TECTONIC_PRESETS[presetName];
        if (!preset) {
            throw new Error(`Unknown Tectonic preset: ${presetName}`);
        }
        if (preset.constants) {
            this.setConstants(preset.constants as Record<string, number>);
        }
        if (preset.noise) {
            for (const [key, state] of Object.entries(preset.noise)) {
                if (state) {
                    this.setNoiseState(key, state);
                }
            }
        }
    }
}

export const TECTONIC_CONFIG = new TectonicConfigRegistry();
