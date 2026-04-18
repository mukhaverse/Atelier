import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../server.js";




//  ### just need to fix the MONGODB ISSUE ###
const basURL = "http://localhost:3000";
 const userId = "anyiddd";

describe("edge coverage", () => {
  


  it("C1 user doesn't exist", async () => {


    const res = await fetch(`${basURL}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.message).toBe("user not found");
  });


  it("user exist but empty cart", async () => {
    
    const userId = "mongodb----id";

    const res = await fetch(`${basURL}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.cartData).toEqual([]);
  });


  it("exist item but null product", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${basURL}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data.cartData)).toBe(true);
  });


  it("craet new group for artist", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${basURL}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.cartData.length).toBeGreaterThan(0);
  });


  // EDDDITTTE LATER 
  it("add item to existing artist group", async () => {
    const userId = "mongodb----id";

    const res = await fetch(`${basURL}/cart/${userId}`);
    const data = await res.json();

    expect(res.status).toBe(200);

    const groupWithManyItems = data.cartData.find(
      (group) => group.items && group.items.length > 1
    );

    expect(groupWithManyItems).toBeDefined();

  });
});




describe("prime coverage",() =>{

  //TC1
it("user doesn't exist",async() => {
  const user=
 expect(res.status).toBe(404);
 expect(data.message).toBe("user not found");
});


//TC2
it("user exist but empty cart", async() =>{

});



//TC3
it("exist item but null product", async() =>{

});



//TC4
it("craet new group for artist", async() =>{

});



//TC5
it("add item to existing artist group", async() =>{

});



});