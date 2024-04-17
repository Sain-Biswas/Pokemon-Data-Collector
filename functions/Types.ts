import PokemonList from "./PokemonList";


export default async function Types(id: string) {
    try {
        const types = await fetch(`https://pokeapi.co/api/v2/type/${id}/`).then((res) => res.json());

        const pokemon = await Promise.all(types.pokemon.map((item: any) => {
            const pokeId = item.pokemon.url.split('/')[6];
            return PokemonList(pokeId);
        }));

        const moves = await Promise.all(types.moves.map((item: any) => getMove(item.url)));

        const doubleDamageFrom = types.damage_relations.double_damage_from.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));
        const doubleDamageTo = types.damage_relations.double_damage_to.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));
        const halfDamageFrom = types.damage_relations.half_damage_from.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));
        const halfDamageTo = types.damage_relations.double_damage_to.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));
        const noDamageFrom = types.damage_relations.no_damage_from.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));
        const noDamageTo = types.damage_relations.no_damage_to.map((item: any) => (item.name[0].toUpperCase() + item.name.slice(1)));

        const result = {
            id: types.id,
            name: types.name[0].toUpperCase() + types.name.slice(1),
            pokemon,
            moves,
            damageClass: (types.move_damage_class) ? types.move_damage_class.name.replaceAll('--', '-').split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ') : "Unknown",
            doubleDamageFrom,
            doubleDamageTo,
            halfDamageFrom,
            halfDamageTo,
            noDamageFrom,
            noDamageTo
        }

        // console.log(result);
        return result;
    } catch (error: any) {
        console.log(`Adding ${id} Failed`);
        console.log(error);
    }
};

async function getMove(url: string) {
    const move = await fetch(url).then((res) => res.json());
    return {
        id: move.id,
        name: move.name.replaceAll('--', '-').split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        type: move.type.name
    }

};

// Types('10002');