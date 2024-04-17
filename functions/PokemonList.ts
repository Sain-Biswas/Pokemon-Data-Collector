import axios, { AxiosError, type AxiosResponse } from "axios"


export default async function PokemonList(id: string) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then((res) => res.json());

        const types: string[] = response.types.map((type: any) => type.type.name);
        const pokemon = {
            id: response.id,
            name: response.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            types
        }

        // console.log(pokemon);
        return pokemon;
    } catch (error: any) {
        console.log(`Adding ${id} Failed`);
        // return new Error(`Adding ${id} Failed.`);
    }
}

PokemonList('10035');