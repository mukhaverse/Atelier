
 const mongoose = require("mongoose");
 const product = require("./models/product");
 const artist = require("./models/artist");
 const User = require('./models/user');
 const cors = require('cors');
 
 //اتصال قاعدة الييانات 
 mongoose
   .connect("mongodb+srv://ghaida:GS.201424@cluster.cakgapc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster")
   .then(() => {
     console.log(" connected successfully");
   })
   .catch((error) => {
     console.log(" error with connecting to the DB", error);
   });
 

const express = require("express")

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
  res.send("Welcom to the Atelier server root!!!")
})


app.get("/products", async (req, res) =>{

  try{
    const products = await product.find()
    console.log("Fething products completed!" )
    res.json(products)
    return
  }catch (error) {
    console.log("error while fetching products ", error)
    return res.send("error ")
  }

    
})


app.get("/products/category/:category", async (req, res) =>{

  try{
    const  catagory  = req.params.category

    const productsByCategory = await product.find({ category: catagory }).lean();

    if(!productsByCategory){
      return res.send("No product was found for this category")
    }

    // const collections = await product.distinct("collections", { catagory })
    // const collections = [...new Set(productsByCategory.map(p => p.collections || p.collections?.[0]))]
    const collections = [
  ...new Set(
    productsByCategory.map(p => Array.isArray(p.collections) ? p.collections[0] : p.collections)
  )
];


    // res.json(productsByCategory)
    
    res.json({
      collections: collections,
      products: productsByCategory
    });
    console.log("Fething products and collections by category is completed!" )
    return

  }catch (error) {
    console.log("error while fetching products by category", error)
    return res.send("error")
  }
 

})


app.get("/products/id/:productId", async (req, res) =>{
    const id = req.params.productId

  try{

    const productById = await product.findById(id)
    if(!productById){
      return res.send("No product was found with this id")
    }

    // res.json(productById)

    const artistById = await artist.findOne({ artistId: productById.artistId  })
    if(!artistById){
      return res.send("No artist was found with this id")
    }

    res.json({
      product: productById,
      artist: artistById
    })
    console.log("Fething products by ID is completed!" )
    return

  }catch (error) {
    console.log("error while fetching products by ID")
    return res.send("error")
  }


})


app.get("/products/collection/:collection", async (req, res) =>{
  
  try{
    const collection = req.params.collection

    const collectionProducts= await product.find({ collections: collection})
    if(!collectionProducts){
      return res.send("No product was found in this collection")
    }

    // res.json(collectionProducts)
    const artistById = await artist.findOne({ artistId: collectionProducts[0].artistId });
    if (!artistById) {
      return res.send("No artist was found for this collection");
    }

    res.json({
      products: collectionProducts,
      artist: artistById
    });

    console.log("Fething products in the collection is completed!" )
    return

  }catch (error) {
    console.log("error while fetching the collection")
    return res.send("error")
  }
 
})


app.get("/collections", async (req, res) => {
  try {
    const collections = await product.distinct("collections");
    if (!collections || collections.length === 0) {
      return res.send("No collections found");
    }

    res.json(collections);
    console.log("Fetching all unique collections completed!");
  } catch (error) {
    console.log("Error while fetching collections:", error);
    res.send("error");
  }
});


app.get("/collections/artist/:artistId", async (req, res) => {
  try {

    const artistId = req.params.artistId;
    const collections = await product.distinct("collections", { artistId: artistId });


    if (!collections || collections.length === 0) {

      return res.send("No collections found for this artist");
    }

    res.json(collections);
    console.log("Fetching collections by artist completed!");
  } catch (error) {
    console.log("Error while fetching collections by artist: ", error);
    res.send("error");
  }

});



app.get("/products/artistId/:artistId", async (req, res) =>{

  try{
    const  artistId  = req.params.artistId

    const productsByArtisan = await product.find({ artistId: artistId })

    if(!productsByArtisan){
      return res.send("No product was found for this category")
    }

    res.json(productsByArtisan)
    

  }catch (error) {
    console.log("error while fetching products by artisan", error)
    return res.send("error")
  }
 

})


app.get("/products/artistId/available/:artistId", async (req, res) => {
  try {
    const artistId = req.params.artistId;

    const inStockProducts = await product.find({
      artistId: artistId,
      availability: "In Stock"
    });

    res.json(inStockProducts);

  } catch (error) {
    console.log("Error while fetching in-stock products by artist:", error);
    return res.send("Error fetching in-stock products");
  }
});

// Wishlist Endpoints
const { Types: { ObjectId } } = require('mongoose');

// check ObjectId
function isValidObjectId(id) { return ObjectId.isValid(id); }

// get wishlist by userId
app.get("/users/:userId/wishlist", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) return res.status(400).json({ message: "Invalid userId" });

    const user = await User.findById(userId, { wishList: 1, _id: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.wishList || []);
  } catch (err) {
    console.error("GET /wishlist error:", err);
    return res.status(500).json({ message: "Error fetching wishlist" });
  }
});

// add to wishlist
app.post("/users/:userId/wishlist", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const exists = await product.exists({ _id: productId }); //check product existence
    if (!exists) return res.status(404).json({ message: "Product not found" });

    const updated = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishList: productId } }, //to avoid duplicates
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" }); //check user existence

    return res.status(200).json({
      message: "Added to wishlist",
      wishlist: updated.wishList
    });
  } catch (err) {
    console.error("POST /wishlist error:", err);
    return res.status(500).json({ message: "Error adding to wishlist" });
  }
});

// Remove from wishlist
app.delete("/users/:userId/wishlist/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishList: productId } }, //Remove productId from wishList array (if exists)
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" }); //check user existence

    return res.status(200).json({
      message: "Removed from wishlist",
      wishlist: updated.wishList
    });
  } catch (err) {
    console.error("DELETE /wishlist/:productId error:", err);
    return res.status(500).json({ message: "Error removing from wishlist" });
  }
});

// toggle wishlist item to switch between add/remove in one button action (add if not exists, remove if exists)
app.put("/users/:userId/wishlist/toggle", async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" }); //check user existence

    const exists = await product.exists({ _id: productId });
    if (!exists) return res.status(404).json({ message: "Product not found" }); //check product existence


    const idx = user.wishList.findIndex(id => id.toString() === productId); //check if productId exists in wishList
    let toggled;
    if (idx > -1) {
      // delete
      await User.updateOne({ _id: userId }, { $pull: { wishList: productId } }); //Remove productId from wishList array
      toggled = "removed";
    } else {
      // add
      await User.updateOne({ _id: userId }, { $addToSet: { wishList: productId } }); //to avoid duplicates
      toggled = "added";
    }

    const populated = await User.findById(userId);
    return res.status(200).json({ toggled, wishlist: populated.wishList });
  } catch (err) {
    console.error("PUT /wishlist/toggle error:", err);
    return res.status(500).json({ message: "Error toggling wishlist" });
  }
});

// End Wishlist Endpoints



app.listen(3000, () =>{
    console.log("I'm listening in the port 3000")
})





app.post("/product", async (req, res) => {
  try {
    // هنا نمرر كل الـ body مباشرة إلى الـ model
    const newProduct = new product(req.body);

    await newProduct.save();

    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Create new artist
app.post("/artists", async (req, res) => {
  try {
    const newArtist = new artist(req.body); 
    await newArtist.save();
    res.json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



app.post("/commission", async (req, res) => {
  try {
    
    const {
      type,
      dimensions,
      attachment,
      description,
      phoneNumber,
      country,
      city,
      isGift,
      artistEmail,
      userEmail,
      username
    } = req.body;

    const newCommission ={
      type,
      dimensions,
      attachment,
      description,
      phoneNumber,
      country,
      city,
      isGift,
      artistEmail,
      userEmail,
      username,
      dateSubmitted: new Date()
    }

    console.log('New commission requested: ', newCommission)

    res.status(201).json({
      message: "Commission request received successfully! ",
      requestData: newCommission
    })

    // afte the comission schema is done 
    // const savedRequest = await CommissionRequest.create(newCommission);
    // await sendCommissionEmail(newCommission.artistEmail, newCommission);
    // res.status(201).json({
    //   message: "Commission request received successfully!",
    //   requestData: savedRequest
    // });

    
  } catch (error) {
    console.error("Error while submitting commission request: ", error)
    res.status(500).json({ message: "Error while submitting commission" })
  }
})