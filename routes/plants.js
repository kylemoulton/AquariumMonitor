var express = require("express"),
    router = express.Router({mergeParams: true}),
    ObjectId = require('mongoose').Types.ObjectId,
    Aquarium = require("../models/aquarium"),
    Plant = require("../models/plant"),
    middleware = require("../middleware");
    
router.get("/new", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("plants/new", {aquarium: foundAquarium});
        }
   });
});

router.post("/", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
        } else {
            if (typeof req.body.species !== "undefined") {
                for (var i = 0; i < req.body.species.length; i++) {
                    var newPlant = new Plant({
                        species: req.body.species[i],
                        count: req.body.speciesCounts[i],
                        owner: {
                            id: req.user._id,
                            username: req.user.username
                        }
                    });
                    newPlant.save();
                    foundAquarium.plants.push(newPlant);
                }
                foundAquarium.save();
            }
        }
    });
    req.flash("success", "Successfully added plant(s)");
    res.redirect("/aquariums/" + req.params.id);
});

router.get("/edit", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id)).populate("plants").exec(function(err, foundAquarium) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
          res.render("plants/edit", {aquarium: foundAquarium});
      }
   });
});

router.put("/", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            foundAquarium.plants.forEach(function(plant) {
               Plant.findByIdAndRemove(plant, function(err) {
                   if (err) {
                       console.log(err);
                   }
               }); 
            });
            
            foundAquarium.plants = [];
            foundAquarium.save();
            
            if (typeof req.body.species !== "undefined") {
                for (var i = 0; i < req.body.species.length; i++) {
                    var newPlant = new Plant({
                        species: req.body.species[i],
                        count: req.body.speciesCounts[i],
                        owner: {
                            id: req.user._id,
                            username: req.user.username
                        }
                    });
                    newPlant.save();
                    foundAquarium.plants.push(newPlant);
                }
                foundAquarium.save();
            }
        }
    });
   res.redirect("/aquariums/" + req.params.id);
});

module.exports = router;