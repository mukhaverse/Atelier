
 const mongoose = require("mongoose");
 const product = require("./models/product");
 const artist = require("./models/artist");
 const User = require('./models/user');
 const bcrypt = require('bcrypt'); 
 const cors = require('cors');
 const jwt = require('jsonwebtoken');
const JWT_SECRET = 'AA.201424';
const Commission = require('./models/commission'); 
const auth = require('./middleware/auth');
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

    //fetch product images
    const results = [];

    for (const collection of collections) {
      const productsInCollection = await product
        .find({ artistId, collections: collection })
        .limit(2) 
        .select("images"); 

      
      const images = productsInCollection.map(p => p.images[0]).filter(Boolean);

      results.push({
        collection,
        images
      });
    }

    res.json(results);
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

     if (!productsByArtisan || productsByArtisan.length === 0) {
      return res.send("No product was found for this artist")
    }


    const artistInfo = await artist.findOne({ artistId })

    if (!artistInfo) {
      return res.send("No artist info found for this artist")
    }

    res.json({
      artist: artistInfo,
      products: productsByArtisan
    })

    

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


const { sendEmail } = require('./email');
const user = require("./models/user");

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
      artistname,
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
      artistname,
      artistEmail,
      userEmail,
      username,
      dateSubmitted: new Date()
    }

    console.log('New commission requested: ', newCommission)

    // artist email 
        try {

          await sendEmail({
            to: artistEmail,
            subject: "New Commission Request",
            template: 'artisanView',
            context: { artistname: artistname },
            attachments: [
              {
                filename: 'Email_icon.svg',
                path: __dirname + '/views/Group 6 (3).svg',
                cid: 'mail@atelier'
              }
            ]
    })} catch (error) {
      console.error("Email error: ", error);
    }


    //  user email
      try {
        await sendEmail({
          to: userEmail,
          subject: "Your Commission Has Been Sent", 
          template: 'userView',
          context: { username },
          attachments: [
        {
          filename: 'Logo_w.svg',
            path: __dirname + '/views/Logo_w.svg',
          cid: 'logo@atelier'
        }
      ]
    })} catch (error) {
      console.error("Email error:" , error);
    }


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


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${field} is already in use.` });
    }
    
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    res.status(201).json({ 
        message: 'Registration successful!', 
        user: { 
            id: newUser._id, 
            username: newUser.username, 
            email: newUser.email 
        } 
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body; 

  try {
    const user = await User.findOne({ $or: [{ email }, { username: email }] }); 

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed. Invalid username or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
        message: 'Login successful!', 
        token,
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email 
        } 
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

app.post('/api/wishlist/add', auth, async (req, res) => {
    const { productId } = req.body; 
    const userId = req.user.userId;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } }, 
            { new: true } 
        ).populate('wishList', 'name price images');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ 
            message: 'Product added to wishlist successfully!', 
            wishList: user.wishList
        });

    } catch (error) {
        console.error('Wishlist Add Error:', error);
        res.status(500).json({ message: 'Server error while adding to wishlist.' });
    }
});

app.get("/users", async (req, res) =>{

  try{
    const users = await user.find()
    console.log("Fething users completed!" )
    res.json(users)
    return
  }catch (error) {
    console.log("error while fetching users ", error)
    return res.send("error ")
  }

    
})

app.get("/user/:userId", async (req,res) =>{
  const userId = req.params.userId
  try{
    const userinfo = await user.findById(userId).select("username email")

    if (!userinfo){
      return res.status(404).send("User not found");
    }

    res.send(userinfo)
    console.log("User info fetched successfully")

  }catch(error){
    console.log("error while fetching a user info ", error)
    res.status(500).send("Error while fetching user info")
  }
}) 


app.listen(3000, () =>{
    console.log("I'm listening in the port 3000")
})

