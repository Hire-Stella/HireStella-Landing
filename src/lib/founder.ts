/**
 * The founder's message on /about.
 *
 * Nothing here is invented. A named quotation attributed to a real person is
 * not something to draft on their behalf, and a portrait cannot be generated,
 * so the block renders only once these are filled in. Until then the story
 * page simply does not carry it, which is better than a placeholder face or
 * words the founder never said.
 *
 * To turn it on: set `name`, `role` and `message`, drop a portrait at
 * `public/brand/founder.webp` (3:4, at least 900px tall) and set `portrait`.
 */
export type Founder = {
  name: string;
  role: string;
  message: string[];
  portrait?: string;
};

export const founder: Founder | null = null;
