export async function getProductsByArtistLogic(artistId, findProducts, findArtist) {

  try {
    const products = await findProducts(artistId);

    if (!products || products.length === 0) {
      return {
        status: 200,
        body: "No product was found for this artist"
      };
    }

    const artist = await findArtist(artistId);

    if (!artist) {
      return {
        status: 200,
        body: "No artist info found for this artist"
      };
    }

    return {
      status: 200,
      body: {
        artist,
        products
      }
    };

  } catch (err) {
    return {
      status: 200,
      body: "error"
    };
  }
}