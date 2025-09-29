
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

app.use(express.json())

app.get("/products", async (req, res) =>{

  try{
    const products = await product.find()
    console.log("Fething products completed!" )
    res.json(products)
    return
  }catch (error) {
    console.log("error while fetching products ")
    return res.send("error")
  }

    
})

app.get("/products/category/:category", async (req, res) =>{

  try{
    const  catagory  = req.params.category

    const productsByCategory = await product.find({ category: catagory})
    if(!productsByCategory){
      return res.send("No product was found for this category")
    }

    res.json(productsByCategory)
    console.log("Fething products by category is completed!" )
    return

  }catch (error) {
    console.log("error while fetching products by category")
    return res.send("error")
  }


})

app.get("/product/id/:id", (req, res) =>{
    res.send("this will fetch a single product")
})


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


