var mongoose = require("mongoose");

var fishSchema = new mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    species: String,
    count: Number 
});

module.exports = mongoose.model("Fish", fishSchema);