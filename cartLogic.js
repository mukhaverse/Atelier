export async function getCartLogic(user, findArtistById) {
  if (!user) {
    return {
      status: 404,
      body: { message: "User not found" }
    };
  }

  let subTotal = 0;
  const groupsObj = {};

  for (const cartItem of user.cart) {
    if (!cartItem.product) continue;

    const product = cartItem.product;

    const lineTotal = product.price;
    subTotal += lineTotal;

    const itemData = {
      productId: product._id,
      name: product.name,
      picture: product.images?.[0] || "",
      price: product.price,
      dimensions: product.dimensions,
      lineTotal
    };

    const artistDoc = await findArtistById(String(product.artistId));
    const artistName = artistDoc?.name || "Unknown Artist";

    if (!groupsObj[artistName]) {
      groupsObj[artistName] = [];
    }

    groupsObj[artistName].push(itemData);
  }

  const groupedCart = Object.keys(groupsObj).map((artist) => ({
    artist,
    items: groupsObj[artist]
  }));

  const TAX_RATE = 0.15;
  const taxAmount = subTotal * TAX_RATE;
  const shipping = 25;
  const total = shipping + subTotal + taxAmount;

  return {
    status: 200,
    body: {
      cartData: groupedCart,
      summary: {
        shipping: parseFloat(shipping.toFixed(2)),
        tax: parseFloat(taxAmount.toFixed(2)),
        subtotal: parseFloat(subTotal.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    }
  };
}