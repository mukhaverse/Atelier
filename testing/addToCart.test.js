import { describe, it, expect } from "vitest";
import { addToCartLogic } from "../addToCartLogic.js";

describe("Edge Coverage", () => {

  it("TC1 missing required fields", () => {
    const result = addToCartLogic(null, "507f1f77bcf86cd799439021", 1, {
      cart: []
    });
    console.log("ACTUAL:", result);
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("Missing required fields: userId and productId are required");
  });

  it("TC2 user not found", () => {
    const result = addToCartLogic(
      "507f1f77bcf86cd799439099",
      "507f1f77bcf86cd799439021",
      1,
      null
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("User not found");
  });

  it("TC3 product already exists in cart", () => {
    const user = {
      cart: [
        {
          product: "507f1f77bcf86cd799439021",
          quantity: 1
        }
      ]
    };

    const result = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021",
      2,
      user
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Cart updated successfully");
    expect(result.body.cart[0].quantity).toBe(3);
  });

  it("TC4 product does not exist in cart", () => {
    const user = {
      cart: []
    };

    const result = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439022",
      1,
      user
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Cart updated successfully");
    expect(result.body.cart.length).toBe(1);
  });

});


describe("Prime Path Coverage", () => {

  it("TC1 missing required fields", () => {
    const result = addToCartLogic(null, "507f1f77bcf86cd799439021", 1, {
      cart: []
    });
    console.log("ACTUAL:", result);
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("Missing required fields: userId and productId are required");
  });

  it("TC2 user not found", () => {
    const result = addToCartLogic(
      "507f1f77bcf86cd799439099",
      "507f1f77bcf86cd799439021",
      1,
      null
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(404);
    expect(result.body.message).toBe("User not found");
  });

  it("TC3 existing item path", () => {
    const user = {
      cart: [
        {
          product: "507f1f77bcf86cd799439021",
          quantity: 1
        }
      ]
    };

    const result = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021",
      2,
      user
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(200);
    expect(result.body.cart[0].quantity).toBe(3);
  });

  it("TC4 new item path", () => {
    const user = {
      cart: []
    };

    const result = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439022",
      1,
      user
    );
    console.log("ACTUAL:", result);
    expect(result.status).toBe(200);
    expect(result.body.cart[0].product).toBe("507f1f77bcf86cd799439022");
    expect(result.body.cart[0].quantity).toBe(1);
  });

});