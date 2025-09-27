
const mongoose = require("mongoose");
const product = require("./models/product");
const artist = require("./models/artist");

//اتصال قاعدة الييانات 
mongoose
  .connect("mongodb+srv://ghaida:Gs.201424@cluster.cakgapc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster")
  .then(() => {
    console.log(" connected successfully");
  })
  .catch((error) => {
    console.log(" error with connecting to the DB", error);
  });




const express = require("express")

const app = express()
// اضفتها عشان يشتغل
app.use(express.json());

app.get("/products", (req, res) => {
    res.send("this will fetch all products")
})

app.get("/products/:category", (req, res) => {
    let category = req.params.category
    res.send(`this will fetch products from the ${category} category`)
})

app.get("/product/:id", (req, res) => {
    res.send("this will fetch a single product")
})

/*
app.post("/product",async(req,res)=>{
  const newproduct = new product();

  const productName = req.body.name
  const productDescription = req.body.description
  const productCareInstructions = req.body.careInstructions
  const productDimensions = req.body.dimensions
  const productImages = req.body.images
  const productPrice = req.body.price
  const productCategory = req.body.category
  const productCollections = req.body.collections
  const productArtistId = req.body.artistId


  
newproduct.name = productName;
newproduct.description = productDescription;
newproduct.careInstructions = productCareInstructions;
newproduct.dimensions = productDimensions;
newproduct.images = productImages;
newproduct.price = productPrice;
newproduct.category = productCategory;
newproduct.collections = productCollections;
newproduct.artistId = productArtistId;



  await newproduct.save()
res.json(newproduct);
  
});*/

//كل الي فوق نقدر نختصره بهذا الكود 
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




app.listen(3000, () => {
    console.log("I'm listening in the port 3000")
})