var mongoose = require("mongoose");

var plantSchema = new mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
            
    },
    species: String,
    count: Number 
});

module.exports = mongoose.model("Plant", plantSchema);