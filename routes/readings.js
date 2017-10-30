var express = require("express"),
    router = express.Router({mergeParams: true}),
    dateFormat      = require("dateformat"),
    ObjectId = require('mongoose').Types.ObjectId,
    Aquarium = require("../models/aquarium"),
    AquariumReading = require("../models/aquariumReading"),
    middleware = require("../middleware");

// Show Readings Index Route
router.get("/", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id))
    .populate("readings")
    .exec(function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("readings/index", {aquarium: foundAquarium});
        }
    })
});

// New Aquarium Reading Route
router.get("/new", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id))
   .populate("readings")
   .exec(function(err, foundAquarium) {
       if (err) {
           console.log(err);
       } else {
           res.render("readings/new", {aquarium: foundAquarium});
       }
   });
});

// Create Aquarium Reading Route
router.post("/", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
       if (err) {
           console.log(err);
           res.redirect("/aquariums");
       } else {
           AquariumReading.create(req.body.reading, function(err, reading) {
              if (err) {
                  console.log(err);
                  res.redirect("/aquariums");
              } else {
                  reading.owner.id = req.user._id;
                  reading.owner.username = req.user.username;
                  reading.save();
                  foundAquarium.readings.push(reading);
                  foundAquarium.save();
                  req.flash("success", "Reading added successfully");
                  res.redirect("/aquariums/" + foundAquarium._id);
              }
           });
       }
    });
});

// Edit Aquarium Reading Route
router.get("/:reading_id/edit", middleware.checkAquariumOwnership, function(req, res) {
    AquariumReading.findById(new ObjectId(req.params.reading_id), function(err, foundReading) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
        res.render("readings/edit", {
            reading: foundReading, 
            aquarium_id: req.params.id, 
            displayDate: dateFormat(foundReading.date, "mmmm d, yyyy"),
            date: dateFormat(foundReading.date, "yyyy-mm-dd")
        });           
       }
    });
});

// Update Reading Route
router.put("/:reading_id", middleware.checkAquariumOwnership, function(req, res) {
   AquariumReading.findByIdAndUpdate(new ObjectId(req.params.reading_id), req.body.reading, function(err, foundReading) {
       if (err) {
           console.log(err);
           req.flash("error", "Could not update chemical parameter reading");
           res.redirect("back");
       } else {
           req.flash("success", "Reading successfully updated");
           res.redirect("/aquariums/" + req.params.id);
       }
   }) 
});

// Destroy Reading Route
router.delete("/:reading_id", middleware.checkAquariumOwnership, function(req, res) {
    AquariumReading.findByIdAndRemove(new ObjectId(req.params.reading_id), function(err) {
        if (err) {
            console.log(err);
            req.flash("error", "Could not delete reading");
            res.redirect("back");
        } else {
            req.flash("success", "Reading deleted successfully");
            res.redirect("/aquariums/" + req.params.id);
        }
    });
});

module.exports = router;