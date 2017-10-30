var mongoose = require("mongoose");

var aquariumReadingSchema = new mongoose.Schema({
   aquarium: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Aquarium"
      },
      name: String
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