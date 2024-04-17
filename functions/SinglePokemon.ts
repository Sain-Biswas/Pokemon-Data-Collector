import PokemonList from "./PokemonList";


export default async function SinglePokemon(id: string) {
    try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json());
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json());

        const types: string[] = pokemonResponse.types.map((type: any) => type.type.name);
        const evolutionChain = await EvolutionChain(speciesResponse.evolution_chain.url);
        const region = await getRegion(speciesResponse.generation.url);
        let canMegaEvolve: boolean = false;
        let canGmax: boolean = false;
        const varieties = await Promise.all(speciesResponse.varieties.filter((vari: any) => !vari.is_default).map((vari: any) => {
            const id = vari.pokemon.url.split('/')[6];
            return PokemonList(id);
        }));
        speciesResponse.varieties.map((vari: any) => {
            const arr = vari.pokemon.name.split('-');
            if (arr.includes('gmax')) canGmax = true;
            if (arr.includes('mega')) canMegaEvolve = true;
        })
        let basestats = pokemonResponse.stats.map((stat: any) => ({ name: stat.stat.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '), value: stat.base_stat }))
        basestats.push({ name: "Base Happiness", value: speciesResponse.base_happiness });
        basestats.push({ name: "Capture Rate", value: speciesResponse.capture_rate });
        const moves = await Promise.all(pokemonResponse.moves.map((move: any) => getMove(move.move.url)));
        const genus = speciesResponse.genera.filter((gen: any) => (gen.language.name === 'en'))[0].genus;
        const flavourText = speciesResponse.flavor_text_entries.map((ele: any) => {
            if (ele.language.name == "en") {
                let ft = ele.flavor_text;
                let ft1 = ft.replace(/\n/g, " ");
                let ft2 = ft1.replace(/\f/g, " ");
                return ft2
            }
        });
        const habitat: string = (speciesResponse.habitat) ? (speciesResponse.habitat.name[0].toUpperCase() + speciesResponse.habitat.name.slice(1)) : "Unknown";
        const shape = (speciesResponse.shape) ? (speciesResponse.shape.name[0].toUpperCase() + speciesResponse.shape.name.slice(1)) : "Unknown";




        const pokemon = {
            id: pokemonResponse.id,
            name: pokemonResponse.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            types,
            habitat,
            color: speciesResponse.color.name[0].toUpperCase() + speciesResponse.color.name.slice(1),
            shape,
            genderRate: speciesResponse.gender_rate,
            canSwitchForm: speciesResponse.forms_switchable,
            haveGenderDifference: speciesResponse.has_gender_differences,
            canMegaEvolve,
            canGmax,
            evolutionChain,
            abilities: pokemonResponse.abilities.filter((ability: any) => (!ability.is_hidden)).map((ability: any) => (ability.ability.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '))),
            hiddenAbilities: pokemonResponse.abilities.filter((ability: any) => (ability.is_hidden)).map((ability: any) => (ability.ability.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '))),
            region,
            basestats,
            weight: pokemonResponse.weight,
            height: pokemonResponse.weight,
            varieties,
            moves,
            isLegendary: speciesResponse.is_legendary,
            isMythical: speciesResponse.is_mythical,
            eggGroups: speciesResponse.egg_groups.map((egg: any) => egg.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ')),
            genus,
            flavourText: [...new Set(flavourText)]
        }
        return pokemon
    } catch (error: any) {
        console.log(`Adding ${id} Failed`);
        console.log(error.message);
    }
}

async function EvolutionChain(url: string) {
    const chain = await fetch(url).then((res) => res.json());
    const response = await EvolutionChainProcessor(chain.chain);
    return response.flat(Infinity);
}
async function EvolutionChainProcessor(data: any) {
    const id = data.species.url.split('/')[6];
    const poke = await PokemonList(id);
    const details = data.evolution_details.map((det: any) => ({ time: det.time_of_day, level: det.min_level, trigger: det.trigger.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ') }));

    const evolveTo = await Promise.all(data.evolves_to.map((dat: any) => EvolutionChainProcessor(dat)));

    return [{
        ...poke,
        name: data.species.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        details
    }, evolveTo]
}
async function getRegion(url: string) {
    const generation = await fetch(url).then((res) => res.json());

    return generation.main_region.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ')
}
async function getMove(url: string) {
    const move = await fetch(url).then((res) => res.json());
    return {
        id: move.id,
        name: move.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        type: move.type.name
    }

}

// SinglePokemon('6');
// EvolutionChain('https://pokeapi.co/api/v2/evolution-chain/2/');