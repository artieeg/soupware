import { generateSlug } from "random-word-slugs";

export async function createRoom() {
  const id = generateSlug();

  return {
    id,
  };
}
