/**
 * Hearthstone Deckstring decoder
 * Spec: https://hearthsim.info/docs/deckstrings/
 *
 * Decodes a base64 deck code into:
 *   - format (standard/wild/classic)
 *   - hero DBF IDs (identifies the class)
 *   - card list with DBF IDs and quantities
 */

export interface DecodedDeck {
  format: number; // 1=Standard, 2=Wild, 3=Classic
  heroes: number[]; // DBF IDs of hero cards
  cards: { dbfId: number; quantity: number }[];
}

function readVarint(buf: Buffer, offset: number): [number, number] {
  let result = 0;
  let shift = 0;
  let byte: number;
  do {
    byte = buf[offset++];
    result |= (byte & 0x7f) << shift;
    shift += 7;
  } while (byte & 0x80);
  return [result, offset];
}

export function decodeDeckstring(code: string): DecodedDeck {
  const buf = Buffer.from(code, "base64");
  let offset = 0;

  const [header, o1] = readVarint(buf, offset);
  offset = o1;
  if (header !== 0) throw new Error("Invalid deckstring header");

  [, offset] = readVarint(buf, offset); // version (always 1)

  const [format, o3] = readVarint(buf, offset);
  offset = o3;

  const [numHeroes, o4] = readVarint(buf, offset);
  offset = o4;
  const heroes: number[] = [];
  for (let i = 0; i < numHeroes; i++) {
    const [h, o] = readVarint(buf, offset);
    offset = o;
    heroes.push(h);
  }

  const cards: DecodedDeck["cards"] = [];

  const [numSingle, o5] = readVarint(buf, offset);
  offset = o5;
  for (let i = 0; i < numSingle; i++) {
    const [c, o] = readVarint(buf, offset);
    offset = o;
    cards.push({ dbfId: c, quantity: 1 });
  }

  const [numDouble, o6] = readVarint(buf, offset);
  offset = o6;
  for (let i = 0; i < numDouble; i++) {
    const [c, o] = readVarint(buf, offset);
    offset = o;
    cards.push({ dbfId: c, quantity: 2 });
  }

  const [numMulti, o7] = readVarint(buf, offset);
  offset = o7;
  for (let i = 0; i < numMulti; i++) {
    const [n, o8] = readVarint(buf, offset);
    offset = o8;
    const [c, o9] = readVarint(buf, offset);
    offset = o9;
    cards.push({ dbfId: c, quantity: n });
  }

  return { format, heroes, cards };
}
