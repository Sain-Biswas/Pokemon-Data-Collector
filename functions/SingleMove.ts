import PokemonList from "./PokemonList";


export default async function SingleMoves(id: string) {
    try {
        const move = await fetch(`https://pokeapi.co/api/v2/move/${id}/`).then((res) => res.json());


        const pokemons = await Promise.all(move.learned_by_pokemon.map((pokemon: any) => {
            const pokeId = pokemon.url.split('/')[6];
            return PokemonList(pokeId);
        }));
        const meta = (move.meta) ? ({
            ailment: move.meta.ailment.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            ailmentChance: move.meta.ailment_chance,
            category: move.meta.category.name.replaceAll('+', '-').split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            critRate: move.meta.crit_rate,
            drain: move.meta.drain,
            flinchChance: move.meta.flinch_chance,
            healing: move.meta.healing,
            maxHits: move.meta.max_hits,
            maxTurns: move.meta.max_turns,
            minHits: move.meta.min_hits,
            minTurns: move.meta.min_turns,
            statChance: move.meta.stat_chance
        }) : null;
        const flavourText = move.flavor_text_entries.filter((item: any) => (item.language.name == 'en')).map((item: any) => {
            let ft = item.flavor_text;
            ft = ft.replace(/\n/g, " ");
            ft = ft.replace(/\f/g, " ");
            return ft
        });
        const effectEntries = move.effect_entries.filter((item: any) => (item.language.name == 'en')).map((item: any) => {
            let ft = item.effect;
            ft = ft.replace(/\n/g, " ");
            ft = ft.replace(/\f/g, " ");
            ft = ft.replace(/\"/g, "");
            return ft
        });
        const statChanges = move.stat_changes.map((item: any) => ({
            change: item.change,
            name: item.stat.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        }))
        const introduced = await getRegion(move.generation.url);





        const result = {
            id: move.id,
            name: move.name.replace('--', '-').split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            type: move.type.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            contestType: (move.contest_type) ? move.contest_type.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ') : "Unknown",
            damageClass: move.damage_class.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            accuracy: move.accuracy,
            effectChance: move.effect_chance,
            target: move.target.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            pp: move.pp,
            power: move.power,
            priority: move.priority,
            pokemons,
            meta,
            statChanges,
            introduced,
            flavourText: [...new Set(flavourText)],
            effectEntries: [...new Set(effectEntries)],
        }

        return result;
    } catch (error: any) {
        console.log(`Adding ${id} Failed.`);
        console.log(error);
    }
}

async function getRegion(url: string) {
    const generation = await fetch(url).then((res) => res.json());

    return {
        name: generation.main_region.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        id: generation.id
    }
};



// SingleMoves('103')