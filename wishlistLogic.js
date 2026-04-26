export function validateWishlistIds(userId, productId) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return !objectIdRegex.test(userId) || !objectIdRegex.test(productId);
}

export function toggleWishlistLogic(wishlist, productId) {
  const index = wishlist.findIndex((id) => id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    return { toggled: "removed", wishlist };
  }

  wishlist.push(productId);
  return { toggled: "added", wishlist };
}