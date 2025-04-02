import { PaginationState } from "@tanstack/react-table";
import {
  PokemonData,
  PokemonDataError,
  PokemonAPI,
  PokemonDetailsAPI,
  PokemonDetails,
} from "./types";

const isFulfilled = <T,>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === "fulfilled";
const isRejected = <T,>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === "rejected";

export const getPokemons = async (
  pagination: PaginationState
): Promise<PokemonData | PokemonDataError> => {
  const limit = pagination.pageSize;
  const offset = pagination.pageIndex * 2;

  const url = new URL("https://pokeapi.co/api/v2/pokemon");
  url.searchParams.set("limit", `${limit}`);
  url.searchParams.set("offset", `${offset}0`);

  try {
    /* Fetch pokemons*/
    const response = await fetch(url.toString());

    if (!response.ok) {
      return { errorMessage: `Response status: ${response.status}` };
    }

    const { count, results }: PokemonAPI = await response.json();
    const promises = results
      .map((item) => item.url)
      .map(async (url) => {
        const response = await fetch(url);
        const pokemonData: PokemonDetailsAPI = await response.json();

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${url}`);
        }

        const pokemon: PokemonDetails = {
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
          types: pokemonData.types.map(({ type }) => type.name).join(","),
        };

        return pokemon;
      });

    /* Fetch pokemons details */
    const responseData = await Promise.allSettled(promises);
    const fulfilledResponse = responseData
      .filter(isFulfilled)
      .map((p) => p.value);
    const rejectedReasons = responseData
      .filter(isRejected)
      .map((p) => p.reason);

    if (rejectedReasons.length) {
      console.error("Failed to fetch a pokemon");
    }

    return {
      rows: fulfilledResponse,
      pageCount: limit,
      rowCount: count,
    };
  } catch (error: unknown) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Failed to fetch pokemons",
    };
  }
};

export const getPokemon = async (
  name: string
): Promise<PokemonDetailsAPI | PokemonDataError> => {
  const url = new URL(`/api/v2/pokemon/${name}`, "https://pokeapi.co");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return { errorMessage: `Response status: ${response.status}` };
    }

    return data;
  } catch (error: unknown) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "Failed to fetch pokemon",
    };
  }
};
