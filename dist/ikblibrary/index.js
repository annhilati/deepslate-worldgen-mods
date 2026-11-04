import { registerFunctions } from '../types.js';
import { CachedVoronoiDF, NearestSeaDF, PullCachedCenterDF, PullFromCachedVoronoiDF, VoronoiCenterDF, VoronoiDistanceDF, VoronoiDF, } from './lib.js';
export * from './lib.js';
export const DENSITY_FUNCTIONS = {
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
export function registerIkbLibrary(registry) {
    registerFunctions(registry, DENSITY_FUNCTIONS);
}
export default registerIkbLibrary;
//# sourceMappingURL=index.js.map