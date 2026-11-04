import type { DensityFunction } from 'deepslate';

export interface Vec3i {
    x: number;
    y: number;
    z: number;
}

export interface Vec3d {
    x: number;
    y: number;
    z: number;
}

/** Precomputed random vectors table for jitter displacement from ikbLib. */
export const RAND_VECS: Float32Array = new Float32Array([
    -0.2700222198, -0.9628540911, 0.3863092627, -0.9223693152, 0.04444859006, -0.999011673, -0.5992523158, -0.8005602176,
    -0.7819280288, 0.6233687174, 0.9464672271, 0.3227999196, -0.6514146797, -0.7587218957, 0.9378472289, 0.347048376,
    -0.8497875957, -0.5271252623, -0.879042592, 0.4767432447, -0.892300288, -0.4514423508, -0.379844434, -0.9250503802,
    -0.9951650832, 0.0982163789, 0.7724397808, -0.6350880136, 0.7573283322, -0.6530343002, -0.9928004525, -0.119780055,
    -0.0532665713, 0.9985803285, 0.9754253726, -0.2203300762, -0.7665018163, 0.6422421394, 0.991636706, 0.1290606184,
    -0.994696838, 0.1028503788, -0.5379205513, -0.84299554, 0.5022815471, -0.8647041387, 0.4559821461, -0.8899889226,
    -0.8659131224, -0.5001944266, 0.0879458407, -0.9961252577, -0.5051684983, 0.8630207346, 0.7753185226, -0.6315704146,
    -0.6921944612, 0.7217110418, -0.5191659449, -0.8546734591, 0.8978622882, -0.4402764035, -0.1706774107, 0.9853269617,
    -0.9353430106, -0.3537420705, -0.9992404798, 0.03896746794, -0.2882064021, -0.9575683108, -0.9663811329, 0.2571137995,
    -0.8759714238, -0.4823630009, -0.8303123018, -0.5572983775, 0.05110133755, -0.9986934731, -0.8558373281, -0.5172450752,
    0.09887025282, 0.9951003332, 0.9189016087, 0.3944867976, -0.2439375892, -0.9697909324, -0.8121409387, -0.5834613061,
    -0.9910431363, 0.1335421355, 0.8492423985, -0.5280031709, -0.9717838994, -0.2358729591, 0.9949457207, 0.1004142068,
    0.6241065508, -0.7813392434, 0.662910307, 0.7486988212, -0.7197418176, 0.6942418282, -0.8143370775, -0.5803922158,
    0.104521054, -0.9945226741, -0.1065926113, -0.9943027784, 0.445799684, -0.8951327509, 0.105547406, 0.9944142724,
    -0.992790267, 0.1198644477, -0.8334366408, 0.552615025, 0.9115561563, -0.4111755999, 0.8285544909, -0.5599084351,
    0.7217097654, -0.6921957921, 0.4940492677, -0.8694339084, -0.3652321272, -0.9309164803, -0.9696606758, 0.2444548501,
    0.08925509731, -0.996008799, 0.5354071276, -0.8445941083, -0.1053576186, 0.9944343981, -0.9890284586, 0.1477251101,
    0.004856104961, 0.9999882091, 0.9885598478, 0.1508291331, 0.9286129562, -0.3710498316, -0.5832393863, -0.8123003252,
    0.3015207509, 0.9534596146, -0.9575110528, 0.2883965738, 0.9715802154, -0.2367105511, 0.229981792, 0.9731949318,
    0.955763816, -0.2941352207, 0.740956116, 0.6715534485, -0.9971513787, -0.07542630764, 0.6905710663, -0.7232645452,
    -0.290713703, -0.9568100872, 0.5912777791, -0.8064679708, -0.9454592212, -0.325740481, 0.6664455681, 0.74555369,
    0.6236134912, 0.7817328275, 0.9126993851, -0.4086316587, -0.8191762011, 0.5735419353, -0.8812745759, -0.4726046147,
    0.9953313627, 0.09651672651, 0.9855650846, -0.1692969699, -0.8495980887, 0.5274306472, 0.6174853946, -0.7865823463,
    0.8508156371, 0.52546432, 0.9985032451, -0.05469249926, 0.1971371563, -0.9803759185, 0.6607855748, -0.7505747292,
    -0.03097494063, 0.9995201614, -0.6731660801, 0.739491331, -0.7195018362, -0.6944905383, 0.9727511689, 0.2318515979,
    0.9997059088, -0.0242506907, 0.4421787429, -0.8969269532, 0.9981350961, -0.061043673, -0.9173660799, -0.3980445648,
    -0.8150056635, -0.5794529907, -0.8789331304, 0.4769450202, 0.0158605829, 0.999874213, -0.8095464474, 0.5870558317,
    -0.9165898907, -0.3998286786, -0.8023542565, 0.5968480938, -0.5176737917, 0.8555780767, -0.8154407307, -0.5788405779,
    0.4022010347, -0.9155513791, -0.9052556868, -0.4248672045, 0.7317445619, 0.6815789728, -0.5647632201, -0.8252529947,
    -0.8403276335, -0.5420788397, -0.9314281527, 0.363925262, 0.5238198472, 0.8518290719, 0.7432803869, -0.6689800195,
    -0.985371561, -0.1704197369, 0.4601468731, 0.88784281, 0.825855404, 0.5638819483, 0.6182366099, 0.7859920446,
    0.8331502863, -0.553046653, 0.1500307506, 0.9886813308, -0.662330369, -0.7492119075, -0.668598664, 0.743623444,
    0.7025606278, 0.7116238924, -0.5419389763, -0.8404178401, -0.3388616456, 0.9408362159, 0.8331530315, 0.5530425174,
    -0.2989720662, -0.9542618632, 0.2638522993, 0.9645630949, 0.124108739, -0.9922686234, -0.7282649308, -0.6852956957,
    0.6962500149, 0.7177993569, -0.9183535368, 0.3957610156, -0.6326102274, -0.7744703352, -0.9331891859, -0.359385508,
    -0.1153779357, -0.9933216659, 0.9514974788, -0.3076565421, -0.08987977445, -0.9959526224, 0.6678496916, 0.7442961705,
    0.7952400393, -0.6062947138, -0.6462007402, -0.7631674805, -0.2733598753, 0.9619118351, 0.9669590226, -0.254931851,
    -0.9792894595, 0.2024651934, -0.5369502995, -0.8436138784, -0.270036471, -0.9628500944, -0.6400277131, 0.7683518247,
    -0.7854537493, -0.6189203566, 0.06005905383, -0.9981948257, -0.02455770378, 0.9996984141, -0.65983623, 0.751409442,
    -0.6253894466, -0.7803127835, -0.6210408851, -0.7837781695, 0.8348888491, 0.5504185768, -0.1592275245, 0.9872419133,
    0.8367622488, 0.5475663786, -0.8675753916, -0.4973056806, -0.2022662628, -0.9793305667, 0.9399189937, 0.3413975472,
    0.9877404807, -0.1561049093, -0.9034455656, 0.4287028224, 0.1269804218, -0.9919052235, -0.3819600854, 0.924178821,
    0.9754625894, 0.2201652486, -0.3204015856, -0.9472818081, -0.9874760884, 0.1577687387, 0.02535348474, -0.9996785487,
    0.4835130794, -0.8753371362, -0.2850799925, -0.9585037287, -0.06805516006, -0.99768156, -0.7885244045, -0.6150034663,
    0.3185392127, -0.9479096845, 0.8880043089, 0.4598351306, 0.6476921488, -0.7619021462, 0.9820241299, 0.1887554194,
    0.9357275128, -0.3527237187, -0.8894895414, 0.4569555293, 0.7922791302, 0.6101588153, 0.7483818261, 0.6632681526,
    -0.7288929755, -0.6846276581, 0.8729032783, -0.4878932944, 0.8288345784, 0.5594937369, 0.08074567077, 0.9967347374,
    0.9799148216, -0.1994165048, -0.580730673, -0.8140957471, -0.4700049791, -0.8826637636, 0.2409492979, 0.9705377045,
    0.9437816757, -0.3305694308, -0.8927998638, -0.4504535528, -0.8069622304, 0.5906030467, 0.06258973166, 0.9980393407,
    -0.9312597469, 0.3643559849, 0.5777449785, 0.8162173362, -0.3360095855, -0.941858566, 0.697932075, -0.7161639607,
    -0.002008157227, -0.9999979837, -0.1827294312, -0.9831632392, -0.6523911722, 0.7578824173, -0.4302626911, -0.9027037258,
    -0.9985126289, -0.05452091251, -0.01028102172, -0.9999471489, -0.4946071129, 0.8691166802, -0.2999350194, 0.9539596344,
    0.8165471961, 0.5772786819, 0.2697460475, 0.962931498, -0.7306287391, -0.6827749597, -0.7590952064, -0.6509796216,
    -0.907053853, 0.4210146171, -0.5104861064, -0.8598860013, 0.8613350597, 0.5080373165, 0.5007881595, -0.8655698812,
    -0.654158152, 0.7563577938, -0.8382755311, -0.545246856, 0.6940070834, 0.7199681717, 0.06950936031, 0.9975812994,
    0.1702942185, -0.9853932612, 0.2695973274, 0.9629731466, 0.5519612192, -0.8338697815, 0.225657487, -0.9742067022,
    0.4215262855, -0.9068161835, 0.4881873305, -0.8727388672, -0.3683854996, -0.9296731273, -0.9825390578, 0.1860564427,
    0.81256471, 0.5828709909, 0.3196460933, -0.9475370046, 0.9570913859, 0.2897862643, -0.6876655497, -0.7260276109,
    -0.9988770922, -0.047376731, -0.1250179027, 0.992154486, -0.8280133617, 0.560708367, 0.9324863769, -0.3612051451,
    0.6394653183, 0.7688199442, -0.01623847064, -0.9998681473, -0.9955014666, -0.09474613458, -0.81453315, 0.580117012,
    0.4037327978, -0.9148769469, 0.9944263371, 0.1054336766, -0.1624711654, 0.9867132919, -0.9949487814, -0.100383875,
    -0.6995302564, 0.7146029809, 0.5263414922, -0.85027327, -0.5395221479, 0.841971408, 0.6579370318, 0.7530729462,
    0.01426758847, -0.9998982128, -0.6734383991, 0.7392433447, 0.639412098, -0.7688642071, 0.9211571421, 0.3891908523,
    -0.146637214, -0.9891903394, -0.782318098, 0.6228791163, -0.5039610839, -0.8637263605, -0.7743120191, -0.6328039957,
]);

/** Half-PI constant in single-precision float (1.5707964f) matching Minecraft Mth.atan2 offset. */
const HALF_PI_FLOAT = 1.5707963705062866;

/** Factor for converting signed 32-bit hash to normalized float value: 1 / 2147493648.0f */
const HASH_TO_FLOAT_FACTOR = Math.fround(1 / 2147493648.0);

export class VoronoiPlate {
    readonly hash: number;
    readonly index: Vec3i;
    readonly center: Vec3d;
    readonly value: number;

    constructor(seed: bigint, index: Vec3i, jitter: number) {
        this.index = index;

        const xPrime = Math.imul(index.x, 501125321);
        const yPrime = Math.imul(index.y, 1136930381);
        const zPrime = Math.imul(index.z, 1720413743);

        const seedLow = Number(BigInt.asIntN(32, seed));
        const xor32 = (seedLow ^ xPrime ^ zPrime ^ yPrime) | 0;
        this.hash = Math.imul(xor32, 0x27d4eb2d);

        this.value = Math.fround(this.hash * HASH_TO_FLOAT_FACTOR);

        const id = this.hash & 0x1fe;

        this.center = {
            x: index.x + RAND_VECS[id] * jitter,
            y: index.y + RAND_VECS[id | 1] * jitter,
            z: index.z + RAND_VECS[id | 2] * jitter,
        };
    }

    getCenterPos(scale: number, flat?: boolean): DensityFunction.Context {
        if (flat) {
            return {
                x: Math.trunc(this.center.x * scale),
                y: 0,
                z: Math.trunc(this.center.z * scale),
            };
        }
        return {
            x: Math.trunc(this.center.x * scale),
            y: Math.trunc(this.center.y * scale),
            z: Math.trunc(this.center.z * scale),
        };
    }

    velocity(): Vec3i {
        return {
            x: (this.hash % 3) - 2,
            y: 0,
            z: Math.trunc(((this.hash % 9) - (this.hash % 3)) / 3) - 2,
        };
    }

    relativeVelocity(otherPlate: VoronoiPlate): number {
        const v0 = this.velocity();
        const v1 = otherPlate.velocity();
        return (
            (this.index.x - otherPlate.index.x) * (v0.x - v1.x) -
            (this.index.z - otherPlate.index.z) * (v0.z - v1.z)
        );
    }

    getDist(point: Vec3d, flat: boolean, metric: number): number {
        const dx = Math.abs(this.center.x - point.x);
        const dy = Math.abs(flat ? 0 : this.center.y - point.y);
        const dz = Math.abs(this.center.z - point.z);

        switch (metric) {
            case 0:
                return dx + dy + dz;
            default:
            case 1:
                return Math.sqrt(dx * dx + dy * dy + dz * dz);
            case 2:
                return Math.max(dx, Math.max(dy, dz));
            case 3:
                return (dx + dy + dz + Math.sqrt(dx * dx + dy * dy + dz * dz)) * 0.5;
            case 4:
                return (dx + dy + dz + Math.max(dx, Math.max(dy, dz))) * 0.5;
            case 5:
                return (Math.sqrt(dx * dx + dy * dy + dz * dz) + Math.max(dx, Math.max(dy, dz))) * 0.5;
        }
    }
}

export function velocityEquals(v0: Vec3i, v1: Vec3i): boolean {
    return v0.x === v1.x && v0.y === v1.y && v0.z === v1.z;
}

export class VoronoiNoise {
    readonly seed: bigint;
    private readonly memoPlates: Map<string, VoronoiPlate> = new Map();

    constructor(seed: bigint | number) {
        this.seed = BigInt(seed);
    }

    static create(seed: bigint | number): VoronoiNoise {
        return new VoronoiNoise(seed);
    }

    getPlate(index: Vec3i, jitter: number): VoronoiPlate {
        const key = `${index.x},${index.y},${index.z}`;
        let plate = this.memoPlates.get(key);
        if (!plate) {
            plate = new VoronoiPlate(this.seed, index, jitter);
            this.memoPlates.set(key, plate);
        }
        return plate;
    }

    calcNearest(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        ordinal: number
    ): { sortPlates: VoronoiPlate[]; sortDistances: Float64Array } {
        const x = blockPos.x / scale;
        const y = flat ? 0 : blockPos.y / scale;
        const z = blockPos.z / scale;

        const posIndex: Vec3i = {
            x: Math.trunc(x >= 0 ? x + 0.5 : x - 0.5),
            y: Math.trunc(y >= 0 ? y + 0.5 : y - 0.5),
            z: Math.trunc(z >= 0 ? z + 0.5 : z - 0.5),
        };

        const sortPlates: VoronoiPlate[] = new Array(ordinal);
        const sortDistances = new Float64Array(ordinal).fill(Number.MAX_VALUE);
        const pt: Vec3d = { x, y, z };

        for (let xi = -1; xi <= 1; xi++) {
            for (let zi = -1; zi <= 1; zi++) {
                const checkIndex: Vec3i = {
                    x: posIndex.x + xi,
                    y: posIndex.y,
                    z: posIndex.z + zi,
                };

                const checkPlate = this.getPlate(checkIndex, jitter);
                const checkDistance = checkPlate.getDist(pt, flat, metric);

                for (let i = 0; i < ordinal; i++) {
                    if (checkDistance < sortDistances[i]) {
                        if (ordinal > 1) {
                            for (let j = ordinal - 1; j > i; j--) {
                                if (sortPlates[j - 1] != null) {
                                    sortDistances[j] = sortDistances[j - 1];
                                    sortPlates[j] = sortPlates[j - 1];
                                }
                            }
                        }
                        sortDistances[i] = checkDistance;
                        sortPlates[i] = checkPlate;
                        break;
                    }
                }
            }
        }

        return { sortPlates, sortDistances };
    }

    calcDistances(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        ordinal: number
    ): Float64Array {
        const x = blockPos.x / scale;
        const y = flat ? 0 : blockPos.y / scale;
        const z = blockPos.z / scale;

        const posIndex: Vec3i = {
            x: Math.trunc(x >= 0 ? x + 0.5 : x - 0.5),
            y: Math.trunc(y >= 0 ? y + 0.5 : y - 0.5),
            z: Math.trunc(z >= 0 ? z + 0.5 : z - 0.5),
        };

        const sortDistances = new Float64Array(ordinal).fill(Number.MAX_VALUE);
        const pt: Vec3d = { x, y, z };

        for (let xi = -1; xi <= 1; xi++) {
            for (let zi = -1; zi <= 1; zi++) {
                const checkIndex: Vec3i = {
                    x: posIndex.x + xi,
                    y: posIndex.y,
                    z: posIndex.z + zi,
                };

                const checkPlate = this.getPlate(checkIndex, jitter);
                const checkDistance = checkPlate.getDist(pt, flat, metric);

                for (let i = 0; i < ordinal; i++) {
                    if (checkDistance < sortDistances[i]) {
                        if (ordinal > 1) {
                            for (let j = ordinal - 1; j > i; j--) {
                                if (sortDistances[j - 1] !== Number.MAX_VALUE) {
                                    sortDistances[j] = sortDistances[j - 1];
                                }
                            }
                        }
                        sortDistances[i] = checkDistance;
                        break;
                    }
                }
            }
        }

        return sortDistances;
    }

    getPlateAtPos(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        ordinal: number
    ): VoronoiPlate {
        return this.calcNearest(blockPos, flat, scale, jitter, metric, ordinal).sortPlates[ordinal - 1];
    }

    getVoronoi(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        mode: number,
        ordinal: number
    ): number {
        if (ordinal === 1) {
            switch (mode) {
                case 2:
                case 5:
                    return 0;
                case 3:
                    return 1;
            }
        }

        const { sortPlates, sortDistances } = this.calcNearest(blockPos, flat, scale, jitter, metric, ordinal);

        switch (mode) {
            default:
            case 0:
                return sortDistances[ordinal - 1];
            case 1:
                return sortPlates[ordinal - 1].value;
            case 2:
                return sortPlates[0].relativeVelocity(sortPlates[ordinal - 1]);
            case 3:
                return velocityEquals(sortPlates[0].velocity(), sortPlates[ordinal - 1].velocity()) ? 1 : 0;
            case 4:
                return (
                    Math.atan2(
                        sortPlates[ordinal - 1].center.z - blockPos.z / scale,
                        sortPlates[ordinal - 1].center.x - blockPos.x / scale
                    ) - HALF_PI_FLOAT
                );
            case 5:
                return (
                    Math.atan2(
                        sortPlates[ordinal - 1].center.z - sortPlates[0].center.z,
                        sortPlates[ordinal - 1].center.x - sortPlates[0].center.x
                    ) - HALF_PI_FLOAT
                );
        }
    }

    getDistance(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        ordinal: number,
        rel: boolean
    ): number {
        if (rel && ordinal === 1) return 0;
        const sortDistances = this.calcDistances(blockPos, flat, scale, jitter, metric, ordinal);
        return rel ? sortDistances[ordinal - 1] - sortDistances[0] : sortDistances[ordinal - 1];
    }
}

export class CachedVoronoiNoise {
    readonly seed: bigint;
    private readonly memoPlates: Map<string, VoronoiPlate> = new Map();

    private readonly memoDists: Map<string, number[]> = new Map();
    private readonly memoValues: Map<string, number[]> = new Map();
    private readonly memoVelocities: Map<string, number[]> = new Map();
    private readonly memoPassives: Map<string, number[]> = new Map();
    private readonly memoDirections: Map<string, number[]> = new Map();
    private readonly memoRelDirections: Map<string, number[]> = new Map();
    private readonly memoNearest: Map<string, VoronoiPlate[]> = new Map();
    private readonly memoCenters: Map<string, DensityFunction.Context[]> = new Map();

    constructor(seed: bigint | number) {
        this.seed = BigInt(seed);
    }

    static create(seed: bigint | number): CachedVoronoiNoise {
        return new CachedVoronoiNoise(seed);
    }

    private posKey(pos: DensityFunction.Context, flat: boolean): string {
        return flat ? `${pos.x},${pos.z}` : `${pos.x},${pos.y},${pos.z}`;
    }

    getPlate(index: Vec3i, jitter: number): VoronoiPlate {
        const key = `${index.x},${index.y},${index.z}`;
        let plate = this.memoPlates.get(key);
        if (!plate) {
            plate = new VoronoiPlate(this.seed, index, jitter);
            this.memoPlates.set(key, plate);
        }
        return plate;
    }

    getDistances(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoDists.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 0);
    }

    getValues(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoValues.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 1);
    }

    getVelocities(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoVelocities.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 2);
    }

    getPassives(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoPassives.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 3);
    }

    getDirections(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoDirections.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 4);
    }

    getRelDirections(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoRelDirections.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.getVoronoi(blockPos, flat, scale, jitter, metric, maxCheck, 5);
    }

    getNearest(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): VoronoiPlate[] {
        const key = this.posKey(blockPos, flat);
        const val = this.memoNearest.get(key);
        if (val && val.length >= maxCheck) return val;
        return this.calcNearest(blockPos, flat, scale, jitter, metric, maxCheck);
    }

    private calcNearest(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): VoronoiPlate[] {
        const key = this.posKey(blockPos, flat);
        const x = blockPos.x / scale;
        const y = flat ? 0 : blockPos.y / scale;
        const z = blockPos.z / scale;

        const posIndex: Vec3i = {
            x: Math.trunc(x >= 0 ? x + 0.5 : x - 0.5),
            y: Math.trunc(y >= 0 ? y + 0.5 : y - 0.5),
            z: Math.trunc(z >= 0 ? z + 0.5 : z - 0.5),
        };

        const sortPlates: VoronoiPlate[] = new Array(maxCheck);
        const sortDistances = new Float64Array(maxCheck).fill(Number.MAX_VALUE);
        const pt: Vec3d = { x, y, z };

        for (let xi = -1; xi <= 1; xi++) {
            for (let zi = -1; zi <= 1; zi++) {
                const checkIndex: Vec3i = {
                    x: posIndex.x + xi,
                    y: posIndex.y,
                    z: posIndex.z + zi,
                };

                const checkPlate = this.getPlate(checkIndex, jitter);
                const checkDistance = checkPlate.getDist(pt, flat, metric);

                for (let i = 0; i < maxCheck; i++) {
                    if (checkDistance < sortDistances[i]) {
                        for (let j = maxCheck - 1; j > i; j--) {
                            if (sortPlates[j - 1] != null) {
                                sortDistances[j] = sortDistances[j - 1];
                                sortPlates[j] = sortPlates[j - 1];
                            }
                        }
                        sortDistances[i] = checkDistance;
                        sortPlates[i] = checkPlate;
                        break;
                    }
                }
            }
        }

        this.memoDists.set(key, Array.from(sortDistances));
        this.memoNearest.set(key, sortPlates);

        return sortPlates;
    }

    private getVoronoi(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number,
        mode: number
    ): number[] {
        const key = this.posKey(blockPos, flat);
        const sortPlates = this.getNearest(blockPos, flat, scale, jitter, metric, maxCheck);
        const outputs = new Array<number>(maxCheck);

        switch (mode) {
            default:
            case 0: {
                const x = blockPos.x / scale;
                const y = flat ? 0 : blockPos.y / scale;
                const z = blockPos.z / scale;
                const pt: Vec3d = { x, y, z };
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] = sortPlates[i].getDist(pt, flat, metric);
                }
                this.memoDists.set(key, outputs);
                break;
            }
            case 1: {
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] = sortPlates[i].value;
                }
                this.memoValues.set(key, outputs);
                break;
            }
            case 2: {
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] = i === 0 ? 0 : sortPlates[0].relativeVelocity(sortPlates[i]);
                }
                this.memoVelocities.set(key, outputs);
                break;
            }
            case 3: {
                const v0 = sortPlates[0].velocity();
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] = i === 0 ? 1 : (velocityEquals(v0, sortPlates[i].velocity()) ? 1 : 0);
                }
                this.memoPassives.set(key, outputs);
                break;
            }
            case 4: {
                const x = blockPos.x / scale;
                const z = blockPos.z / scale;
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] =
                        Math.atan2(sortPlates[i].center.z - z, sortPlates[i].center.x - x) - HALF_PI_FLOAT;
                }
                this.memoDirections.set(key, outputs);
                break;
            }
            case 5: {
                for (let i = 0; i < maxCheck; i++) {
                    outputs[i] =
                        i === 0
                            ? 0
                            : Math.atan2(
                                  sortPlates[i].center.z - sortPlates[0].center.z,
                                  sortPlates[i].center.x - sortPlates[0].center.x
                              ) - HALF_PI_FLOAT;
                }
                this.memoRelDirections.set(key, outputs);
                break;
            }
        }

        return outputs;
    }

    sample(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        ordinal: number,
        sampler: DensityFunction
    ): number {
        const key = this.posKey(blockPos, flat);
        const centers = this.memoCenters.get(key) ?? this.computeCenters(blockPos, flat, scale, jitter, metric, ordinal);
        return sampler.compute(centers[ordinal - 1]);
    }

    computeCenters(
        blockPos: DensityFunction.Context,
        flat: boolean,
        scale: number,
        jitter: number,
        metric: number,
        maxCheck: number
    ): DensityFunction.Context[] {
        const key = this.posKey(blockPos, flat);
        const sortPlates = this.getNearest(blockPos, flat, scale, jitter, metric, maxCheck);
        const sortCenters = new Array<DensityFunction.Context>(maxCheck);

        for (let i = 0; i < maxCheck; i++) {
            sortCenters[i] = sortPlates[i].getCenterPos(scale);
        }

        this.memoCenters.set(key, sortCenters);
        return sortCenters;
    }

    static getDefaultWatersheds(): { plates: VoronoiPlate[]; gradients: number[] } {
        return {
            plates: [new VoronoiPlate(0n, { x: 0, y: 0, z: 0 }, 0)],
            gradients: [0],
        };
    }

    getWatersheds(
        index: Vec3i,
        jitter: number,
        sampler: DensityFunction,
        scale: number,
        flat: boolean,
        metric: number
    ): { plates: VoronoiPlate[]; gradients: number[] } {
        const sortPlates: VoronoiPlate[] = new Array(9);
        const sortedGrad = new Array<number>(9);

        sortPlates[0] = this.getPlate(index, jitter);
        sortedGrad[0] = sampler.compute(sortPlates[0].getCenterPos(scale));

        for (let xi = -1; xi <= 1; xi++) {
            for (let zi = -1; zi <= 1; zi++) {
                if (xi !== 0 && zi !== 0) {
                    const checkIndex: Vec3i = {
                        x: index.x + xi,
                        y: index.y,
                        z: index.z + zi,
                    };

                    const checkPlate = this.getPlate(checkIndex, jitter);
                    const checkDist = checkPlate.getDist(sortPlates[0].center, flat, metric);
                    const checkGradient =
                        checkDist === 0
                            ? 0
                            : (sampler.compute(checkPlate.getCenterPos(scale)) - sortedGrad[0]) / checkDist;

                    for (let i = 1; i < 9; i++) {
                        if (checkGradient < sortedGrad[i]) {
                            for (let j = 8; j > i; j--) {
                                if (sortPlates[j - 1] != null) {
                                    sortedGrad[j] = sortedGrad[j - 1];
                                    sortPlates[j] = sortPlates[j - 1];
                                }
                            }
                            sortedGrad[i] = checkGradient;
                            sortPlates[i] = checkPlate;
                            break;
                        }
                    }
                }
            }
        }

        return { plates: sortPlates, gradients: sortedGrad };
    }
}
