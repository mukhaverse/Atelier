import { describe, it, expect } from "vitest";
import { addToCartLogic } from "../addToCartLogic.js";

describe("Prime Path Coverage - Add To Cart", () => {
  it("TC3.2.2.1 - missing required fields - path [1,2,3]", () => {
    const actual = addToCartLogic(null, "507f1f77bcf86cd799439021", 1, {
      cart: []
    });

    console.log("ACTUAL TC3.2.2.1:", actual);

    expect(actual.status).toBe(400);
    expect(actual.body.message).toBe(
      "Missing required fields: userId and productId are required"
    );
  });

  it("TC3.2.2.2 - user not found - path [1,2,4,5,6]", () => {
    const actual = addToCartLogic(
      "507f1f77bcf86cd799439099",
      "507f1f77bcf86cd799439021",
      1,
      null
    );

    console.log("ACTUAL TC3.2.2.2:", actual);

    expect(actual.status).toBe(404);
    expect(actual.body.message).toBe("User not found");
  });

  it("TC3.2.2.3 - product does not exist in cart - path [1,2,4,5,7,8,10,11]", () => {
    const user = {
      cart: []
    };

    const actual = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439022",
      1,
      user
    );

    console.log("ACTUAL TC3.2.2.3:", actual);

    expect(actual.status).toBe(200);
    expect(actual.body.message).toBe("Cart updated successfully");
    expect(actual.body.cart.length).toBe(1);
    expect(actual.body.cart[0].product).toBe("507f1f77bcf86cd799439022");
    expect(actual.body.cart[0].quantity).toBe(1);
  });

  it("TC3.2.2.4 - product already exists in cart - path [1,2,4,5,7,8,9,11]", () => {
    const user = {
      cart: [
        {
          product: "507f1f77bcf86cd799439021",
          quantity: 1
        }
      ]
    };

    const actual = addToCartLogic(
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439021",
      2,
      user
    );

    console.log("ACTUAL TC3.2.2.4:", actual);

    expect(actual.status).toBe(200);
    expect(actual.body.message).toBe("Cart updated successfully");
    expect(actual.body.cart[0].quantity).toBe(3);
  });
});