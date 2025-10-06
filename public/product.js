// Wait until the entire DOM is loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // Retrieve the selected product data from localStorage
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));

  // If no product data is found, log an error and stop execution
  if (!productData) {
    console.error("No product data found in localStorage!");
    return;
  }

  // Select key HTML elements on the product page
  const img = document.querySelector(".product_image img");               
  const title = document.querySelector(".title");                         
  const artisanName = document.querySelector(".artisan.account h3");      
  const username = document.querySelector(".artisan.account .username");  
  const avatar = document.querySelector(".artisan.account img");          

  // Update page content with product data retrieved from localStorage
  img.src = productData.collectionImage;                 
  title.textContent = productData.collectionName;        
  artisanName.textContent = productData.category || "Artisan"; 
  username.textContent = productData.username || "@unknown";   
  avatar.src = productData.profilePic;                   
});
