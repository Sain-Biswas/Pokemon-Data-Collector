import MovesList from "./functions/MoveList";
import PokemonList from "./functions/PokemonList";
import SingleMoves from "./functions/SingleMove";
import SinglePokemon from "./functions/SinglePokemon";
import Types from "./functions/Types";


// Part to add Pokemon List to Database
const pokemonList = await Promise.all([...Array(1025)].map((_, i) => PokemonList(`${i + 1}`)));
await Bun.write("./Data/PokemonList.json", JSON.stringify(pokemonList));


// Part to add Single Pokemon List to Database
const pokemon = await Promise.all([...Array(1025)].map((_, i) => SinglePokemon(`${i + 1}`)));
await Bun.write("./Data/SinglePokemon.json", JSON.stringify(pokemon));


// Part to add Moves List to Database
const moveList = await Promise.all([...Array(919)].map((_, i) => MovesList(`${i + 1}`)));
// const moveList = await Promise.all([...Array(18)].map((_, i) => SingleMoves(`${i + 10001}`)));
await Bun.write("./Data/MovesList.json", JSON.stringify(moveList));


// Part to add Single Moves List to Database
const move = await Promise.all([...Array(919)].map((_, i) => MovesList(`${i + 1}`)));
// const move = await Promise.all([...Array(18)].map((_, i) => SingleMoves(`${i + 10001}`)));
await Bun.write("./Data/SingleMoves.json", JSON.stringify(move));


// Part to add Types to Database
const types = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 10001, 10002].map((_, i) => Types(`${i}`)));
// const types = await Types('10002');
await Bun.write("./Data/Types.json", JSON.stringify(types));