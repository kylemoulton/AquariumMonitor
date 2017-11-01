var mongoose = require("mongoose");

var waterChangeSchema = new mongoose.Schema({
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    date: Date,
    amount: Number
});


module.exports = mongoose.model("WaterChange", waterChangeSchema);