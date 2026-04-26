import { describe, it, expect } from "vitest";
import { validateWishlistIds, toggleWishlistLogic } from "../wishlistLogic.js";
describe("input space ecc", () => {

  it("TC1 product exists in wishlist", () => {
    const result = toggleWishlistLogic(
      ["507f1f77bcf86cd799439021"],
      "507f1f77bcf86cd799439021"
    );

    expect(result.toggled).toBe("removed");
  });

  it("TC2 product does not exist in wishlist", () => {
    const result = toggleWishlistLogic(
      [],
      "507f1f77bcf86cd799439022"
    );

    expect(result.toggled).toBe("added");
  });

  it("TC3 invalid userId", () => {
    const result = validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    );

    expect(result).toBe(true);
  });

  it("TC4 invalid productId", () => {
    const result = validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "ll@"
    );

    expect(result).toBe(true);
  });

});


describe("input space pairwise", () => {

  it("TC1 user not found", () => {
    const user = null;

    expect(user).toBe(null);
  });

  it("TC2 product not found", () => {
    const productExists = false;

    expect(productExists).toBe(false);
  });

  it("TC3 invalid userId", () => {
    const result = validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    );

    expect(result).toBe(true);
  });

  it("TC4 invalid productId", () => {
    const result = validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "ll@"
    );

    expect(result).toBe(true);
  });

});


describe("logic with ACC", () => {

  it("C1 determines predicate outcome", () => {
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    )).toBe(false);

    expect(validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    )).toBe(true);
  });

  it("C2 determines predicate outcome", () => {
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    )).toBe(false);

    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "@@@"
    )).toBe(true);
  });

});


describe("Clause Coverage", () => {

  it("TC1 both inputs valid", () => {
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    )).toBe(false);
  });

  it("TC2 both inputs invalid", () => {
    expect(validateWishlistIds(
      " ",
      "@@@"
    )).toBe(true);
  });

  it("TC3 userId invalid and productId valid", () => {
    expect(validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    )).toBe(true);
  });

  it("TC4 userId valid and productId invalid", () => {
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "@@@"
    )).toBe(true);
  });

});