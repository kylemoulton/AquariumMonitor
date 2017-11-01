var mongoose = require("mongoose");

var aquariumReadingSchema = new mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: Date,
    ammonia: Number,
    generalHardness: Number,
    carbonateHardness: Number,
    pH: Number,
    nitrite: Number,
    nitrate: Number
});

module.exports = mongoose.model("AquariumReading", aquariumReadingSchema);