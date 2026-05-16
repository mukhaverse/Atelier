import { describe, it, expect } from "vitest";
import { getProductsByArtistLogic } from "./getProductsByArtistLogic.js";
import data from "./productsByArtist.json";





// Coverage Criteria 1: CC 


describe("Clause Coverage", () => {


  it("TC1.1.2.1", async () => {
    const result = await getProductsByArtistLogic("507f1f77bcf86cd799439011", findProducts, findArtist);
    expect(result.status).toBe(200);
    expect(result.body.products.length).toBeGreaterThan(0);
    expect(result.body.artist).toEqual({ name: "Artist One" });
  });



  it("TC1.1.2.4 ", async () => {
    const result = await getProductsByArtistLogic(null, findProductsNull, findArtist);
    expect(result.status).toBe(200);
    expect(result.body).toBe("No product was found for this artist");
  });

  
  it("TC1.1.2.2 ", async () => {
    const result = await getProductsByArtistLogic("Ajh34f3n6i6nfndjcididnidn2", findProducts, findArtist);
    expect(result.status).toBe(200);
    expect(result.body).toBe("No product was found for this artist");
  });


  


  it("TC1.1.2.3 ", async () => {
    const result = await getProductsByArtistLogic("627f1f88bng86sd759439993", findProducts, findArtist);
    expect(result.status).toBe(200);
    expect(result.body).toBe("No product was found for this artist");
  });

});






// Coverage Criteria 2: ACC 


describe("Active Clause Coverage ", () => {


  it("TC1.1.2.1 ", async () => {
    const result = await getProductsByArtistLogic("507f1f77bcf86cd799439011", findProducts, findArtist);
    expect(result.status).toBe(200);
    expect(result.body.products.length).toBeGreaterThan(0);
    expect(result.body.artist).toEqual({ name: "Artist One" });
  });


  
  it("TC1.1.2.4 ", async () => {
    const result = await getProductsByArtistLogic(null, findProductsNull, findArtist);
    expect(result.status).toBe(200);
    expect(result.body).toBe("No product was found for this artist");
  });


  
  it("TC1.1.2.2 ", async () => {
    const result = await getProductsByArtistLogic("Ajh34f3n6i6nfndjcididnidn2", findProducts, findArtist);
    expect(result.status).toBe(200);
    expect(result.body).toBe("No product was found for this artist");
  });


  

  it("TC1.1.2.3 ", async () => {
    const result = await getProductsByArtistLogic("627f1f88bng86sd759439993", findProducts, findArtist);
    expect(result.status).toBe(200);

    
    expect(result.body).toBe("No product was found for this artist");
  });

});







// Mock helpers


async function findProducts(artistId) {

  return data.products[artistId] || [];
}

async function findProductsNull(_artistId) {

  return null;
}

async function findArtist(artistId) {
  return data.artists[artistId] || null;
}