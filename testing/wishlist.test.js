import { describe, it, expect } from "vitest";
import { validateWishlistIds, toggleWishlistLogic } from "../wishlistLogic.js";

const validUserId = "507f1f77bcf86cd799439011";
const validProductId = "507f1f77bcf86cd799439021";
const nonExistingUserId = "507f1f77bcf86cd799439012";
const nonExistingProductId = "507f1f77bcf86cd799439022";

function runWishlistTest({ userId, productId, userExists, productExists, wishlist }) {
  const invalidInput = validateWishlistIds(userId, productId);

  if (invalidInput) {
    return {
      status: 400,
      message: "invalid userId or productId",
    };
  }

  if (!productExists) {
    return {
      status: 404,
      message: "Product not found",
    };
  }

  if (!userExists) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  const result = toggleWishlistLogic(wishlist, productId);

  return {
    status: 200,
    toggled: result.toggled,
    wishlist: result.wishlist,
  };
}

describe("Coverage Criteria 1: ECC", () => {
  it("TC2.2.1.1 - valid userId/productId, product NOT in wishlist", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: validProductId,
      userExists: true,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.1:", actual);

    expect(actual.status).toBe(200);
    expect(actual.toggled).toBe("added");
  });

  it("TC2.2.1.2 - empty userId and empty productId", () => {
    const actual = runWishlistTest({
      userId: "",
      productId: "",
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.2:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.1.3 - null userId and null productId", () => {
    const actual = runWishlistTest({
      userId: null,
      productId: null,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.3:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.1.4 - whitespace userId and whitespace productId", () => {
    const actual = runWishlistTest({
      userId: " ",
      productId: " ",
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.4:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.1.5 - number userId and number productId", () => {
    const actual = runWishlistTest({
      userId: 12345,
      productId: 67890,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.5:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.1.6 - boolean userId and boolean productId", () => {
    const actual = runWishlistTest({
      userId: true,
      productId: false,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.6:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.1.7 - userId valid format but user NOT in DB", () => {
    const actual = runWishlistTest({
      userId: nonExistingUserId,
      productId: validProductId,
      userExists: false,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.7:", actual);

    expect(actual.status).toBe(404);
    expect(actual.message).toBe("User not found");
  });

  it("TC2.2.1.8 - productId valid format but product NOT in DB", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: nonExistingProductId,
      userExists: true,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.1.8:", actual);

    expect(actual.status).toBe(404);
    expect(actual.message).toBe("Product not found");
  });

  it("TC2.2.1.9 - product already exists in wishlist", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: validProductId,
      userExists: true,
      productExists: true,
      wishlist: [validProductId],
    });

    console.log("ACTUAL TC2.2.1.9:", actual);

    expect(actual.status).toBe(200);
    expect(actual.toggled).toBe("removed");
  });
});

describe("Coverage Criteria 2: Pairwise", () => {
  it("TC2.2.2.1 - valid inputs, product NOT in wishlist", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: validProductId,
      userExists: true,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.1:", actual);

    expect(actual.status).toBe(200);
    expect(actual.toggled).toBe("added");
  });

  it("TC2.2.2.2 - valid inputs, product already in wishlist", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: validProductId,
      userExists: true,
      productExists: true,
      wishlist: [validProductId],
    });

    console.log("ACTUAL TC2.2.2.2:", actual);

    expect(actual.status).toBe(200);
    expect(actual.toggled).toBe("removed");
  });

  it("TC2.2.2.3 - user NOT in DB", () => {
    const actual = runWishlistTest({
      userId: nonExistingUserId,
      productId: validProductId,
      userExists: false,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.3:", actual);

    expect(actual.status).toBe(404);
    expect(actual.message).toBe("User not found");
  });

  it("TC2.2.2.4 - product NOT in DB", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: nonExistingProductId,
      userExists: true,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.4:", actual);

    expect(actual.status).toBe(404);
    expect(actual.message).toBe("Product not found");
  });

  it("TC2.2.2.5 - empty userId, valid productId", () => {
    const actual = runWishlistTest({
      userId: "",
      productId: validProductId,
      userExists: false,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.5:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.6 - valid userId, empty productId", () => {
    const actual = runWishlistTest({
      userId: validUserId,
      productId: "",
      userExists: true,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.6:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.7 - null userId, null productId", () => {
    const actual = runWishlistTest({
      userId: null,
      productId: null,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.7:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.8 - whitespace userId, empty productId", () => {
    const actual = runWishlistTest({
      userId: " ",
      productId: "",
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.8:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.9 - number userId, whitespace productId", () => {
    const actual = runWishlistTest({
      userId: 99999,
      productId: " ",
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.9:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.10 - boolean userId, number productId", () => {
    const actual = runWishlistTest({
      userId: false,
      productId: 12345,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.10:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.11 - empty userId, boolean productId", () => {
    const actual = runWishlistTest({
      userId: "",
      productId: true,
      userExists: false,
      productExists: false,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.11:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });

  it("TC2.2.2.12 - null userId, valid productId", () => {
    const actual = runWishlistTest({
      userId: null,
      productId: validProductId,
      userExists: false,
      productExists: true,
      wishlist: [],
    });

    console.log("ACTUAL TC2.2.2.12:", actual);

    expect(actual.status).toBe(400);
    expect(actual.message).toBe("invalid userId or productId");
  });
});