# deepslate-worldgen-mods

This project provides extensions for the Minecraft simulation library [Deepslate](https://github.com/misode/deepslate) regarding worldgen. Support for popular worldgen libraries and fixes for historic Deepslate bugs are featured.

## Supported Mods

#### Worldgen Libraries

- **[More Density Functions](https://github.com/klinbee/More-Density-Functions)** 2.3.0 (@klinbee)
- **[Lithostitched](https://github.com/Apollounknowndev/lithostitched)** 2.0.6 (@Apollounknowndev)
- **[ikbLib](https://github.com/ikkyblob/ikbLib)** 1.0.0 (@ikkyblob)
- **[En-sityFunctions](https://github.com/MikeStorm03/En-sityFunctions)** 1.1.0 (MikeStorm03) 

#### Worldgen Projects

- **[Tectonic](https://modrinth.com/datapack/tectonic)** 3.0 (@Apollounknowndev)
- **[Larion](https://github.com/ViciousBadger/larion-world-generation)** 4.3.0 (@ViciousBadger)


## Deepslate Versions

Deepslate follows a development pattern, where it is always and only up to date to the newest Minecraft full release version
which means that for simulating old game versions, outdated versions of Deepslate must be used for that.
Worldgen underwent big format changes a few times making distinctions of the following versions neccesarry:

Game Versions    | Deepslate Version
---------------- | ---------
26.3 +           | `*`
1.21.9 – 26.3    | `^0.26.2`
1.18.2 – 1.21.8  | `^0.24.0`

The "newest" or latest compatible version should always be used, which are the versions stated above.

## How to use

1. Install via npm's `github` scope:
    ```sh
    npm install github:Annhilati/deepslate-mod-compatability
    ```
2. (to be improved)
    ```ts
    import { DensityFunction, Identifier } from 'deepslate';
    import { registerAll } from 'deepslate-worldgen-mods';

    registerAll(Registry.REGISTRY.get(
        Identifier.parse("minecraft:density_function_type")
    ));
    ```

---

## Declaration of AI-use
<h3>Almost all implementations in this repository were created by generative AI in an agentic process.</h3>
<h6>Although I am a strong advocate of reserving certain processes in programming for humans.</h6>

Here is why I think that is okay:
1. **Deepslate is "just" a tool.** These mods and the data packs they enable are to be considered a form of art and are subject to a privilege reserved for humans. Undoubtedly, any code can lay claim to being art. However, this is subjective to the creator. This project is not art. It is an extension for an ingeniously practical tool where the latter is simply meant to work.
2. **The implementation methods are already clear.** We simply need to mirror the behavior of the mods from Java to TypeScript. Deepslate also demonstrates what implementations for its framework should look like and that's to be adhered to. This process of translation mostly does not require a special form of creativity (which I would normally like to be performed by a human).
3. While such a porting does not require creativity **it still can be very exhausting** - because of the sheer amount of code or its complexity or because it contains a lot finely tuned details that can lead to accidental errors during the transfer.

**But of course, all contributions from humans are very welcome too.**