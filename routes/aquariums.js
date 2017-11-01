var express = require("express"),
    router = express.Router({mergeParams: true}),
    Aquarium = require("../models/aquarium"),
    ObjectId = require('mongoose').Types.ObjectId,
    middleware = require("../middleware");
    
// Show Aquarium Index Route
router.get("/", function(req, res) {
    Aquarium.find({}, function(err, allAquariums) {
        if (err) {
            console.log(err);
        } else {
            res.render("aquariums/index", {aquariums: allAquariums});
        }
    });
});

// New Aquarium Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("aquariums/new");
});

// Create Aquarium Route
router.post("/", middleware.isLoggedIn, function(req, res) {
   var newAquarium = {
       name: req.body.name,
       image: req.body.image,
       type: req.body.type,
       size: req.body.size,
       description: req.body.description,
       owner: {
           id: req.user._id,
           username: req.user.username
       }
   }
   Aquarium.create(newAquarium, function(err, newlyCreatedAquarium) {
       if (err) {
           req.flash("error", "Could not create new aquarium");
           res.redirect("back");
           console.log(err);
       } else {
           req.flash("success", newlyCreatedAquarium.name + " created successfully!");
           res.redirect("/aquariums");
       }
   });
});

// Show Aquarium Route
router.get("/:id", function(req, res) {
  Aquarium.findById(new ObjectId(req.params.id))
    .populate("readings")
    .populate("waterChanges")
    .populate("fish")
    .populate("plants")
    .populate("comments")
    .exec(function(err, foundAquarium) {
      if (err) {
          console.log(err);
      } else {
        res.render("aquariums/show", {aquarium: foundAquarium});
      }
  }); 
});

// Edit Aquarium Route
router.get("/:id/edit", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
          res.render("aquariums/edit", {aquarium: foundAquarium});
      }
   });
});

// Update Aquarium Route
router.put("/:id/", middleware.checkAquariumOwnership, function(req, res) {
    var updatedAquarium = {
        name: req.body.name,
        image: req.body.image,
        size: req.body.size,
        type: req.body.type,
        description: req.body.description
    };
    Aquarium.findByIdAndUpdate(new ObjectId(req.params.id), updatedAquarium, function(err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/aquariums/" + req.params.id);
        }
    });
});

// Destroy Aquarium Route
router.delete("/:id", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findByIdAndRemove(new ObjectId(req.params.id), function(err) {
        if (err) {
            req.flash("error", "Could not delete aquarium");
            res.redirect("back");
        } else {
            req.flash("success", "Aquarium deleted successfully");
            res.redirect("/aquariums");
        }
    });
});

module.exports = router;