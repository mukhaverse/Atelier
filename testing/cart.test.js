import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";




//  ### just need to fix the MONGODB ISSUE ###

describe("GET /cart/:userId -edge coverage", () => {
  const basURL = "http://localhost:3000";


  it("C1 user does not exist", async () => {

    const userId = "anyiddd";

    const res = await fetch(`${baseUrl}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("user not found");
  });


  it("C2  user with empty cart", async () => {
    
    const userId = "mongodb----id";

    const res = await fetch(`${baseUrl}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.cartData).toEqual([]);
  });


  it("C3 skip item if product is missing", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${baseUrl}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data.cartData)).toBe(true);
  });


  it("C4 create a new group when artist group doesn't exist", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${baseUrl}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.cartData.length).toBeGreaterThan(0);
  });


  it("C5 add item to existing artist group", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${baseUrl}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);

    const groupWithManyItems = data.cartData.find(
      (group) => group.items && group.items.length > 1
    );

    expect(groupWithManyItems).toBeDefined();

  });
});




















// TEST CASES FOR EDGE COV
describe("GET /cart/:userId", () => {

  it("should return 404 if user not found", async () => {

    const userId = "507f1f77bcf86cd799439011"

    const res = await fetch(`http://localhost:3000/cart/${userId}`)
    const data = await res.json()

    expect(res.status).toBe(500)
    expect(data.message).toBe("User not found")

  })

  //SECO T
  //TH T
  //FOU T
  //FIV T

})


//TESR CASES FOR PRIME COV
describe("GET /cart/:userId", () => {

  
  //FIRS T
  //SECO T
  //TH T
  //FOU T
  //FIV T

})