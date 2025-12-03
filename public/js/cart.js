document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");

fetch(`https://atelier-0adu.onrender.com/cart/${userId}`)
    .then(res => res.json())
    .then(data => {
        console.log("CART RESPONSE →", data);
        renderCart(data);
    })
    .catch(err => console.error("Error loading cart:", err));


});


// Render whole cart
function renderCart(data) {
    const container = document.querySelector(".cartContainer");
    container.innerHTML = "";

    const grouped = data.cartData;
    const summary = data.summary;

    // Loop through each artist group
    grouped.forEach(group => {
        const artistName = group.artist;
        const items = group.items;

        // Create a wrapper for the artist
        const artistSection = document.createElement("div");
        artistSection.classList.add("artistGroup");

        // Artist header
        artistSection.innerHTML = `
            <div class="artistHeader">
                <h3>${artistName}</h3>
            </div>
        `;

        // For each product under this artist
        items.forEach((item, index) => {
            const itemHTML = `
                <div class="cartItem">
                    <button class="removeBtn" data-id="${item.productId}">✕</button>

                    <img src="${item.picture || "assets/placeholder.png"}" class="productImg" alt="${item.name}">

                    <div class="details">
                        <h4>${item.name}</h4>
                        <p>${item.dimensions || "—"}</p>
                    </div>

                    <p class="price">${item.price.toFixed(2)} sr</p>
                </div>

                ${index !== items.length - 1 ? "<hr>" : ""}
            `;

            artistSection.insertAdjacentHTML("beforeend", itemHTML);
        });

        container.appendChild(artistSection);
    });

    // Render summary (right side)
    document.querySelector(".shipping").textContent = summary.shipping.toFixed(2) + "sr";
    document.querySelector(".tax").textContent = summary.tax.toFixed(2) + "sr";
    document.querySelector(".Subtotal").textContent = summary.total.toFixed(2) + "sr";
    document.querySelector(".total").textContent = summary.total.toFixed(2) + "sr";

    attachRemoveEvents();
}



// Remove item from cart
function attachRemoveEvents() {
    const removeButtons = document.querySelectorAll(".removeBtn");

    removeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const productId = btn.getAttribute("data-id");
            const userId = localStorage.getItem("userId");

            fetch("/cart/remove", {
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


