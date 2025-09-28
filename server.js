
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

app.get("/products", (req, res) =>{
    res.send("this will fetch all products")
})

app.get("/products/:category", (req, res) =>{
    let category = req.params.category
    res.send(`this will fetch products from the ${category} category`)
})

app.get("/product/id", (req, res) =>{
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


