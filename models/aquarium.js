var mongoose = require("mongoose");

var aquariumSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String,
    description: String,
    size: Number,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    fish: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fish"
        }
    ],
    plants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plant",
        }
    ],
    readings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AquariumReading"            
        }
    ],
    waterChanges: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterChange"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ]
});

module.exports = mongoose.model("Aquarium", aquariumSchema);