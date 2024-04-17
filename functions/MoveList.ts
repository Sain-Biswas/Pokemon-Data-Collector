

export default async function MovesList(id: string) {
    try {
        const move = await fetch(`https://pokeapi.co/api/v2/move/${id}/`).then((res) => res.json());

        const result = {
            id: move.id,
            name: move.name.replace('--', '-').split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            type: move.type.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
            contestType: (move.contest_type) ? (move.contest_type.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' ')) : "Unknown",
            damageClass: move.damage_class.name.split('-').map((part: string) => (part[0].toUpperCase() + part.slice(1))).join(' '),
        }
        return result;
        // console.log(result)
    } catch (error: any) {
        console.log(`Adding ${id} Failed`);
        console.log(error);
    }
}

// MovesList('652');