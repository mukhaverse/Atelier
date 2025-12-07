
document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

    fetch(`https://atelier-0adu.onrender.com/cart/${userId}`)
        .then(res => res.json())
        .then(data => {
            console.log("CART RESPONSE →", data);
            renderCart(data);
        })
        .catch(err => console.error("Error loading cart:", err));

    console.log("🟦 CART ROUTE HIT with userId:", userId);
    console.log("🟨 PRODUCT:", cartItem.product);
    //console.log("🟥 artistId:", cartItem.product?.artistId);
});



// Render whole cart
function renderCart(data) {
    const container = document.querySelector(".cartContainer");
    // Clear the container before rendering new data
    container.innerHTML = ""; 

    const grouped = data.cartData;
    const summary = data.summary;

    if (!grouped || grouped.length === 0 || !grouped.some(group => group.items.length > 0)) {
        // Create an element to show the "Cart Empty" message
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("empty-cart-message");
        emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 100px; color: #ffffffff;">
                        <img class="WhiteCart" src="assets/White_cart.svg" alt="Cart icon" width="44" height="44">

                <h2>Your Cart is Empty</h2>
               
            </div>
        `;
        container.appendChild(emptyMessage);
        
        
        // Exit the function since there's nothing else to render
        return; 
    }

    //  Render Grouped Cart Items 
    
    // Loop through each artist group
    grouped.forEach(group => {
        const artistName = group.artist;
        const items = group.items;

        // Create the wrapper for the entire artist group: <div class="card">
        const artistCard = document.createElement("div");
        artistCard.classList.add("card");

        // Artist header: <h3 class="artistName">
        artistCard.innerHTML = `
            <h3 class="artistName">${artistName}</h3>
        `;

        // For each product under this artist
        items.forEach((item, index) => {
            const itemHTML = `
                <div class="productDetails">
                    <div class="iconTrash">
                        <button class="removeBtn" data-id="${item.productId}">
                             <img class="trash" src="assets/trash.svg" alt="trash icon" width="24" height="24">

                        </div>
                    
                    <img 
                    class="productImage navigable"  // 
                    data-product-id="${item.productId}" // 
                    src="${item.picture || "assets/placeholder.jpg"}" 
                    alt="${item.name}">

                    <div class="details">
                        <h3 class="productName">${item.name}</h3>
                        <p class="dim">${item.dimensions || "Dimensions N/A"}</p>
                    </div>

                    <h3 class="price">${item.price.toFixed(2)}sr</h3>
                </div>
                
                ${index !== items.length - 1 ? '<div class="cardDividor"></div>' : ''}
            `;
            
            

            artistCard.insertAdjacentHTML("beforeend", itemHTML);
            
        });

        // Append the completed card to the main cart container
        container.appendChild(artistCard);
        
    });

    attachRemoveEvents();
    attachImageClickEvents();
    //  Render Summary Totals 

    document.querySelector(".shipping").textContent = summary.shipping.toFixed(2) + " sr";
    document.querySelector(".tax").textContent = summary.tax.toFixed(2) + " sr";
    
    
    document.querySelector(".Subtotal").textContent = summary.subtotal.toFixed(2) + " sr"; 
    document.querySelector(".total").textContent = summary.total.toFixed(2) + " sr";

    // Re-attach event listeners to the new remove buttons
    attachRemoveEvents();
}



// Remove item from cart
function attachRemoveEvents() {
    const removeButtons = document.querySelectorAll(".removeBtn");

    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = btn.getAttribute("data-id");
            const userId = localStorage.getItem("userId");

            fetch("https://atelier-0adu.onrender.com/cart/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, productId })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Removed:", data);
                location.reload(); // refresh to show updated cart
            })
            .catch(err => console.error("Remove error:", err));
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.querySelector(".checkout-button");
    
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            const userId = localStorage.getItem("userId");
            
            if (!userId) {
                // If user is not logged in, prompt and redirect to login
                alert("Please log in to proceed to checkout.");
                window.location.href = "login.html";
            } else {
                // If logged in, redirect to checkout.html
                // It's often helpful to pass the userId in the URL for the checkout page
                window.location.href = `Checkout.html?user=${userId}`;
            }
        });
    }
});

// Add this new function definition to your <script> block
function attachImageClickEvents() {
    const images = document.querySelectorAll(".productImage.navigable");

    images.forEach(img => {
        // Optional: Add a pointer cursor in CSS for this element: .productImage.navigable { cursor: pointer; }
        
        img.addEventListener("click", () => {
            const productId = img.getAttribute("data-product-id");
            
            if (productId) {
                // Navigate to the product page using the extracted ID
                window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
            } else {
                console.error('Missing product ID for image navigation.');
            }
        });
    });
}