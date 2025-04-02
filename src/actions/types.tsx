export interface PokemonResults {
  name: string;
  url: string;
}

export interface PokemonAPI {
  results: PokemonResults[];
  count: number;
}

export interface PokemonDetailsAPI {
  id: number;
  name: string;
  sprites: SpritesAPI;
  types: TypesAPI[];
  abilities: AbilitiesAPI[];
  game_indices: GameIndicesAPI[];
  stats: StatsAPI[];
}

export interface AbilitiesAPI {
  ability: AbilityAPI;
}

export interface AbilityAPI {
  slot: number;
  name: string;
}

export interface GameIndicesAPI {
  version: VersionAPI;
}

export interface VersionAPI {
  name: string;
}

export interface StatsAPI {
  stat: StatAPI;
}

export interface StatAPI {
  name: string;
}

export interface SpritesAPI {
  front_default: string;
}

export interface TypesAPI {
  type: TypeAPI;
}

export interface TypeAPI {
  name: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  image: string;
  types: string;
}

export interface PokemonData {
  rows: PokemonDetails[];
  pageCount: number;
  rowCount: number;
}

export interface PokemonDataError {
  errorMessage: string;
}
