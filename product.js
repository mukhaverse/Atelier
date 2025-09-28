

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    //   عشانه بتكون تلقائي تطلعIDماحطيت 

    name: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    //خليتها مصفوفة عشان نحط اكثر من صورة للمنتج
    images: [{ type: String }],
    dimensions: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
    //كمان هنا لان يمكن يكون اكثر من تصنيف
    collections: [{ type: String }],

    // IDهنا نربط المنتج في الفنان عن طريق 
    artistId: { type: String, required: true },
});

const product = mongoose.model("product", productSchema);

module.exports = product;
