import type { DensityFunctionMap, DensityFunctionRegistry } from '../types.js';
import { registerFunctions } from '../types.js';

import {
    CachedVoronoiDF,
    NearestSeaDF,
    PullCachedCenterDF,
    PullFromCachedVoronoiDF,
    VoronoiCenterDF,
    VoronoiDistanceDF,
    VoronoiDF,
} from './lib.js';

export * from './lib.js';

export const DENSITY_FUNCTIONS: DensityFunctionMap = {
    'ikblibrary:cached_voronoi': CachedVoronoiDF.fromJson,
    'ikblibrary:voronoi': VoronoiDF.fromJson,
    'ikblibrary:voronoi_dist': VoronoiDistanceDF.fromJson,
    'ikblibrary:voronoi_center': VoronoiCenterDF.fromJson,
    'ikblibrary:near_sea': NearestSeaDF.fromJson,
    'ikblibrary:pull_cached_voronoi': PullFromCachedVoronoiDF.fromJson,
    'ikblibrary:sample_voronoi_center': PullCachedCenterDF.fromJson,
};

/**
 * Registers all ikbLib density functions into the provided registry.
 */
export function registerIkbLibrary(registry: DensityFunctionRegistry): void {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}

export default registerIkbLibrary;
