import { describe, it, expect } from "vitest";
import { getProductsByArtistLogic } from "./getProductsByArtistLogic.js";
import data from "./productsByArtist.json";


async function findProducts(artistId) {
  return data.products[artistId] || []
}

async function findArtist(artistId) {
  return data.artists[artistId] || null
}




describe("CC / ACC Coverage", () => {
    

    it("TC1 - valid artist with products", async () => {
        const result = await getProductsByArtistLogic("A1", findProducts, findArtist);
        expect(result.body.products.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    });

    it("TC2 - invalid artistId (null)", async () => {
        const result = await getProductsByArtistLogic(null, findProducts, findArtist);
        expect(result.body).toBe("No product was found for this artist");
        expect(result.status).toBe(200);
    });

    it("TC3 - artist does not exist", async () => {
        const result = await getProductsByArtistLogic("999", findProducts, findArtist);
        expect(result.body).toBe("No product was found for this artist");
        expect(result.status).toBe(200);
    });

    it("TC4 - artist exists but no products", async () => {
        const result = await getProductsByArtistLogic("A2", findProducts, findArtist);
        expect(result.body).toBe("No product was found for this artist");
        expect(result.status).toBe(200);
    });

});






 
describe("ECC Coverage", () => {


    it("TC1 - valid artist exists and has products", async () => {

        const res = await getProductsByArtistLogic("A1", findProducts, findArtist)
        expect(res.body.products.length).toBeGreaterThan(0)
        expect(res.status).toBe(200)

    })


    it("TC2 - empty artistId", async () => {
        const res = await getProductsByArtistLogic("", findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })




    it("TC3 - null artistId", async () => {
        const res = await getProductsByArtistLogic(null, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })



    it("TC4 - non-existing artistId", async () => {
        const res = await getProductsByArtistLogic("999", findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)
    })




    it("TC5 - number artistId", async () => {
        const res = await getProductsByArtistLogic(123, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })




    it("TC6 - boolean artistId", async () => {
        const res = await getProductsByArtistLogic(true, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)
        
    })




})




describe("Pairwise Coverage", () => {


    it("TC7 - valid artist with products", async () => {
        const res = await getProductsByArtistLogic("A1", findProducts, findArtist)
        expect(res.body.products.length).toBeGreaterThan(0)
        expect(res.status).toBe(200)
    })




    it("TC8 - valid artist with no products", async () => {
        const res = await getProductsByArtistLogic("A2", findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })



    it("TC9 - valid format but artist does not exist", async () => {
        const res = await getProductsByArtistLogic("999", findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })



    it("TC10 - empty artistId", async () => {
        const res = await getProductsByArtistLogic("", findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })



    it("TC11 - null artistId", async () => {
        const res = await getProductsByArtistLogic(null, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)
    })




    it("TC12 - number artistId", async () => {
        const res = await getProductsByArtistLogic(123, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)
    })



    it("TC13 - boolean artistId", async () => {
        const res = await getProductsByArtistLogic(true, findProducts, findArtist)
        expect(res.body).toBe("No product was found for this artist")
        expect(res.status).toBe(200)

    })



})