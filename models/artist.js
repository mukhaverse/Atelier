

const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
    // خليته يدوي عشان سهل نحفظه و نربطه بالمنتج حقه
    artistId: { type: String, required: true, unique: true },

    username: { type: String, required: true },
    profilePic: { type: String, default: "" },
});

const artist = mongoose.model("artist", artistSchema);

module.exports = artist;

