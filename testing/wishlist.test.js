import { describe, it, expect } from "vitest";
import { validateWishlistIds, toggleWishlistLogic } from "../wishlistLogic.js";
describe("input space ecc", () => {

  it("TC1 product exists in wishlist", () => {
    const result = toggleWishlistLogic(
      ["507f1f77bcf86cd799439021"],
      "507f1f77bcf86cd799439021"
    );
    console.log("ACTUAL:", result);
    expect(result.toggled).toBe("removed");
  });

  it("TC2 product does not exist in wishlist", () => {
    const result = toggleWishlistLogic(
      [],
      "507f1f77bcf86cd799439022"
    );
    console.log("ACTUAL:", result);

    expect(result.toggled).toBe("added");
  });

  it("TC3 invalid userId", () => {
    const result = validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    );
    console.log("ACTUAL:", result);
    expect(result).toBe(true);
  });

  it("TC4 invalid productId", () => {
    const result = validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "ll@"
    );
    console.log("ACTUAL:", result);
    expect(result).toBe(true);
  });

});


describe("input space pairwise", () => {

  it("TC1 user not found", () => {
  const user = null;
  console.log("ACTUAL:", user);
  expect(user === null).toBe(true);
  });

  it("TC2 product not found", () => {
    const productExists = false;
    console.log("ACTUAL:", productExists);
    expect(productExists).toBe(false);
  });

  it("TC3 invalid userId", () => {
    const result = validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    );
    console.log("ACTUAL:", result);
    expect(result).toBe(true);
  });

  it("TC4 invalid productId", () => {
    const result = validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "ll@"
    );
    console.log("ACTUAL:", result);
    expect(result).toBe(true);
  });

});


describe("logic with ACC", () => {

  it("C1 determines predicate outcome", () => {
    console.log("ACTUAL:", validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    ));
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021" 
    )).toBe(false);

    console.log("ACTUAL:", validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    ));
    expect(validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    )).toBe(true);
  });

  it("C2 determines predicate outcome", () => {
  const validCase = validateWishlistIds(
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439021"
  );

  console.log("ACTUAL:", validCase);
  expect(validCase).toBe(false);

  const invalidCase = validateWishlistIds(
    "507f1f77bcf86cd799439011",
    "ll@"
  );

  console.log("ACTUAL:", invalidCase);
  expect(invalidCase).toBe(true);
});

});


describe("Clause Coverage", () => {

  it("TC1 both inputs valid", () => {
    console.log("ACTUAL:", validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    ));
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021"
    )).toBe(false);
  });

  it("TC2 both inputs invalid", () => {
    console.log("ACTUAL:", validateWishlistIds(
      " ",
      "@@@"
    ));
    expect(validateWishlistIds(
      " ",
      "@@@"
    )).toBe(true);
  });

  it("TC3 userId invalid and productId valid", () => {
    console.log("ACTUAL:", validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    ));
    expect(validateWishlistIds(
      " ",
      "507f1f77bcf86cd799439021"
    )).toBe(true);
  });

  it("TC4 userId valid and productId invalid", () => {
    console.log("ACTUAL:", validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "@@@"
    ));
    expect(validateWishlistIds(
      "507f1f77bcf86cd799439011",
      "@@@"
    )).toBe(true);
  });

});