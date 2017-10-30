var express = require("express"),
    router = express.Router({mergeParams: true}),
    ObjectId = require('mongoose').Types.ObjectId,
    dateFormat      = require("dateformat"),
    Aquarium = require("../models/aquarium"),
    WaterChange = require("../models/water_change"),
    middleware = require("../middleware");
    
// Show Water Changes Index Route
router.get("/", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id)).populate("waterChanges").exec(function(err, foundAquarium) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           res.render("water_changes/index", {aquarium: foundAquarium});
       }
   });
});
    
// New Water Change Route
router.get("/new", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           res.render("water_changes/new", {aquarium: foundAquarium});
       }
    });
});

// Create Water Change Route
router.post("/", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            WaterChange.create(req.body.waterChange, function(err, waterChange) {
               if (err) {
                   console.log(err);
                   res.redirect("back");
               } else {
                    waterChange.owner.id = req.user._id;
                    waterChange.owner.username = req.user.username;
                    waterChange.save();
                    foundAquarium.waterChanges.push(waterChange);
                    foundAquarium.save();
                    req.flash("success", "Water change added successfully");
                    res.redirect("/aquariums/" + foundAquarium._id);
               }
            });
        }
   });
});

// Edit Water Change Update
router.get("/:change_id/edit", middleware.checkAquariumOwnership, function(req, res) {
    WaterChange.findById(new ObjectId(req.params.change_id), function(err, foundWaterChange) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           res.render("water_changes/edit", {
               waterChange: foundWaterChange,
               aquarium_id: req.params.id,
               date: dateFormat(foundWaterChange.date, "yyyy-mm-dd")
           });
       }
    });
});

// Update Water Change Route
router.put("/:change_id", middleware.checkAquariumOwnership, function(req, res) {
   WaterChange.findByIdAndUpdate(new ObjectId(req.params.change_id), req.body.waterChange, function(err, waterChange) {
        if (err) {
           console.log(err);
           res.redirect("back");
        } else {
            req.flash("success", "Water change successfully updated");
            res.redirect("/aquariums/" + req.params.id);
        } 
   });
});

// Destroy Water Change Route
router.delete("/:change_id", middleware.checkAquariumOwnership, function(req, res) {
   WaterChange.findByIdAndRemove(new ObjectId(req.params.change_id), function(err) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
          req.flash("success", "Successfully deleted water change");
          res.redirect("/aquariums/" + req.params.id);
      }
   });
});

module.exports = router;