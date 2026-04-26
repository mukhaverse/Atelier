import { describe, it, expect } from "vitest";
import mockCartData from "./cartTest.json";
import { getCartLogic } from "./cartLogic.js";

async function findArtistById(artistId) {
  const artists = {
    a1: { name: "Artist One" }
  };

  return artists[artistId] || null;
}

describe("Edge Coverage", () => {
  it("TC1 user doesn't exist", async () => {
    const result = await getCartLogic(mockCartData.userNotFound, findArtistById);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe("User not found");
  });

  it("TC2 user exists but empty cart", async () => {
    const result = await getCartLogic(mockCartData.emptyCartUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData).toEqual([]);
    expect(result.body.summary.subtotal).toBe(0);
  });

  it("TC3 item exists but product is null", async () => {
    const result = await getCartLogic(mockCartData.nullProductUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData).toEqual([]);
  });

  it("TC4 create new group for artist", async () => {
    const result = await getCartLogic(mockCartData.newGroupUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData.length).toBeGreaterThan(0);
    expect(result.body.cartData[0].artist).toBe("Artist One");
  });

  it("TC5 add item to existing artist group", async () => {
    const result = await getCartLogic(mockCartData.existingGroupUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData[0].items.length).toBeGreaterThan(1);
  });
});

describe("Prime Path Coverage", () => {
  it("TC1 user doesn't exist", async () => {
    const result = await getCartLogic(mockCartData.userNotFound, findArtistById);

    expect(result.status).toBe(404);
    expect(result.body.message).toBe("User not found");
  });

  it("TC2 user exists but empty cart", async () => {
    const result = await getCartLogic(mockCartData.emptyCartUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData).toEqual([]);
  });

  it("TC3 item exists but product is null", async () => {
    const result = await getCartLogic(mockCartData.nullProductUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData).toEqual([]);
  });

  it("TC4 create new group for artist", async () => {
    const result = await getCartLogic(mockCartData.newGroupUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData[0].artist).toBe("Artist One");
  });

  it("TC5 add item to existing artist group", async () => {
    const result = await getCartLogic(mockCartData.existingGroupUser, findArtistById);

    expect(result.status).toBe(200);
    expect(result.body.cartData[0].items.length).toBeGreaterThan(1);
    expect(result.body.summary.subtotal).toBeGreaterThan(0);
  });
});