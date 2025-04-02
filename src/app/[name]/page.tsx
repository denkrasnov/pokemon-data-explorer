import { getPokemon } from "~app/actions/pokemon";
import Image from "next/image";
import { GeneralError } from "~app/components/GeneralError";

export const Pokemon = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;
  const pokemon = await getPokemon(name);

  if ("errorMessage" in pokemon) {
    return <GeneralError />;
  }

  const {
    abilities,
    game_indices,
    name: pokemonName,
    sprites: { front_default },
    stats,
    types,
  } = pokemon;

  return (
    <div className="flex flex-col items-center min-h-screen bg-(--primary-color)">
      <main className="flex flex-col min-h-screen items-center w-4/5 bg-white">
        <h1 className="text-4xl font-bold mt-6">Pokemon Details</h1>
        <figure className="flex justify-center items-center flex-col">
          <Image
            width={300}
            height={300}
            src={front_default}
            alt="Pokemon image"
          />
          <figcaption className="text-4xl text-center">
            {pokemonName}
          </figcaption>
        </figure>
        <div className="w-4/5 min-w-[300px] bg-white p-5 mb-[45px]">
          <h2 className="mt-6 font-bold text-2xl">Details</h2>
          <div className="flex">
            <div className="mt-6 flex flex-col mr-4">
              <h3 className="font-bold">Attributes</h3>
              {abilities.map(({ ability }) => {
                return <div key={ability.name}>{ability.name}</div>;
              })}
            </div>
            <div className="mt-6 flex flex-col mr-4">
              <h3 className="font-bold">Attributes</h3>
              {stats.map(({ stat }) => {
                return <div key={stat.name}>{stat.name}</div>;
              })}
            </div>
            <div className="mt-6 flex flex-col mr-4">
              <h3 className="font-bold">Types</h3>
              {types.map(({ type }) => {
                return <div key={type.name}>{type.name}</div>;
              })}
            </div>
            <div className="mt-6 flex flex-col">
              <h3 className="font-bold">Version</h3>
              {game_indices.map(({ version }) => {
                return <div key={version.name}>{version.name}</div>;
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pokemon;
