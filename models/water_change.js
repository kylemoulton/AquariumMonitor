var mongoose = require("mongoose");

var waterChangeSchema = new mongoose.Schema({
    aquarium: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Aquarium"
        },
        name: String
    },
    date: Date,
    amount: Number
});


module.exports = mongoose.model("WaterChange", waterChangeSchema);