import { describe, it, expect } from "vitest";

// Standalone varint reader matching deck-code.ts implementation
function readVarint(buf: Uint8Array, offset: { val: number }): number {
  let result = 0;
  let shift = 0;
  while (offset.val < buf.length) {
    const b = buf[offset.val++];
    result |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return result;
}

// Encode number to varint bytes
function encodeVarint(n: number): number[] {
  const bytes: number[] = [];
  while (n > 0x7f) {
    bytes.push((n & 0x7f) | 0x80);
    n >>= 7;
  }
  bytes.push(n);
  return bytes;
}

// Build a minimal deck code buffer (header + version + format + hero + cards)
function buildDeckBuffer(opts: {
  format?: number;
  heroes?: number[];
  singleCopy?: number[];
  doubleCopy?: number[];
  multiCopy?: { dbfId: number; count: number }[];
}): Uint8Array {
  const bytes: number[] = [
    ...encodeVarint(0), // header
    ...encodeVarint(1), // version
    ...encodeVarint(opts.format ?? 2), // format (2 = standard)
    ...encodeVarint(opts.heroes?.length ?? 1), // num heroes
    ...(opts.heroes ?? [7]).flatMap(h => encodeVarint(h)), // hero dbfIds
    ...encodeVarint(opts.singleCopy?.length ?? 0),
    ...(opts.singleCopy ?? []).flatMap(id => encodeVarint(id)),
    ...encodeVarint(opts.doubleCopy?.length ?? 0),
    ...(opts.doubleCopy ?? []).flatMap(id => encodeVarint(id)),
    ...encodeVarint(opts.multiCopy?.length ?? 0),
    ...(opts.multiCopy ?? []).flatMap(m => [...encodeVarint(m.dbfId), ...encodeVarint(m.count)]),
  ];
  return new Uint8Array(bytes);
}

describe("readVarint", () => {
  it("decodes single-byte values", () => {
    expect(readVarint(new Uint8Array([0x00]), { val: 0 })).toBe(0);
    expect(readVarint(new Uint8Array([0x01]), { val: 0 })).toBe(1);
    expect(readVarint(new Uint8Array([0x7f]), { val: 0 })).toBe(127);
  });

  it("decodes multi-byte values", () => {
    // 128 = 0x80 -> varint: [0x80, 0x01]
    expect(readVarint(new Uint8Array([0x80, 0x01]), { val: 0 })).toBe(128);
    // 300 = 0x12C -> varint: [0xAC, 0x02]
    expect(readVarint(new Uint8Array([0xac, 0x02]), { val: 0 })).toBe(300);
  });

  it("advances offset correctly", () => {
    const buf = new Uint8Array([0x05, 0x80, 0x01]);
    const offset = { val: 0 };
    expect(readVarint(buf, offset)).toBe(5);
    expect(offset.val).toBe(1);
    expect(readVarint(buf, offset)).toBe(128);
    expect(offset.val).toBe(3);
  });

  it("handles zero-length buffer gracefully", () => {
    expect(readVarint(new Uint8Array([]), { val: 0 })).toBe(0);
  });
});

describe("buildDeckBuffer (deck code structure)", () => {
  it("produces valid header and version", () => {
    const buf = buildDeckBuffer({});
    const offset = { val: 0 };
    expect(readVarint(buf, offset)).toBe(0); // header
    expect(readVarint(buf, offset)).toBe(1); // version
  });

  it("encodes format correctly", () => {
    for (const fmt of [1, 2, 3]) {
      const buf = buildDeckBuffer({ format: fmt });
      const offset = { val: 0 };
      readVarint(buf, offset); // header
      readVarint(buf, offset); // version
      expect(readVarint(buf, offset)).toBe(fmt);
    }
  });

  it("round-trips single-copy card count", () => {
    const buf = buildDeckBuffer({ singleCopy: [100, 200] });
    const offset = { val: 0 };
    readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset);
    const numSingle = readVarint(buf, offset);
    expect(numSingle).toBe(2);
    expect(readVarint(buf, offset)).toBe(100);
    expect(readVarint(buf, offset)).toBe(200);
  });

  it("round-trips double-copy card count", () => {
    const buf = buildDeckBuffer({ doubleCopy: [300, 400, 500] });
    const offset = { val: 0 };
    readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset);
    const numDouble = readVarint(buf, offset);
    expect(numDouble).toBe(3);
  });

  it("round-trips multi-copy cards", () => {
    const buf = buildDeckBuffer({ multiCopy: [{ dbfId: 600, count: 3 }] });
    const offset = { val: 0 };
    readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset); readVarint(buf, offset);
    const numMulti = readVarint(buf, offset);
    expect(numMulti).toBe(1);
    expect(readVarint(buf, offset)).toBe(600);
    expect(readVarint(buf, offset)).toBe(3);
  });
});

describe("encodeVarint", () => {
  it("is inverse of readVarint", () => {
    for (const n of [0, 1, 127, 128, 255, 300, 1000, 100000]) {
      const bytes = encodeVarint(n);
      expect(readVarint(new Uint8Array(bytes), { val: 0 })).toBe(n);
    }
  });
});
