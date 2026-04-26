export function addToCartLogic(userId, productId, quantity, user) {
  if (!userId || !productId) {
    return {
      status: 400,
      body: {
        message: "Missing required fields: userId and productId are required"
      }
    };
  }

  if (!user) {
    return {
      status: 404,
      body: {
        message: "User not found"
      }
    };
  }

  const qty = quantity && quantity > 0 ? quantity : 1;

  const itemIndex = user.cart.findIndex((item) => item.product === productId);

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += qty;
  } else {
    user.cart.push({
      product: productId,
      quantity: qty,
      dateAdded: new Date()
    });
  }

  return {
    status: 200,
    body: {
      message: "Cart updated successfully",
      cart: user.cart
    }
  };
}