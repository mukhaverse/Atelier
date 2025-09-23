/**
 * these lines are for Ghaida for any database code
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

const express = require("express")

const app = express()

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