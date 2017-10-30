var express = require("express"),
    router = express.Router({mergeParams: true}),
    ObjectId = require('mongoose').Types.ObjectId,
    Aquarium = require("../models/aquarium"),
    Fish = require("../models/fish"),
    middleware = require("../middleware");
    
router.get("/new", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("fish/new", {aquarium: foundAquarium});
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
                    var newFish = new Fish({
                        species: req.body.species[i],
                        count: req.body.speciesCounts[i],
                        owner: {
                            id: req.user._id,
                            username: req.user.username
                        }
                    });
                    newFish.save();
                    foundAquarium.fish.push(newFish);
                }
                foundAquarium.save();
            }
        }
    });
    req.flash("success", "Successfully added fish");
    res.redirect("/aquariums/" + req.params.id);
});

router.get("/edit", middleware.checkAquariumOwnership, function(req, res) {
   Aquarium.findById(new ObjectId(req.params.id)).populate("fish").exec(function(err, foundAquarium) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
          res.render("fish/edit", {aquarium: foundAquarium});
      }
   });
});

router.put("/", middleware.checkAquariumOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            foundAquarium.fish.forEach(function(fish) {
               Fish.findByIdAndRemove(fish, function(err) {
                   if (err) {
                       console.log(err);
                   }
               }); 
            });
            
            foundAquarium.fish = [];
            foundAquarium.save();
            
            if (typeof req.body.species !== "undefined") {
                for (var i = 0; i < req.body.species.length; i++) {
                    var newFish = new Fish({
                        species: req.body.species[i],
                        count: req.body.speciesCounts[i],
                        owner: {
                            id: req.user._id,
                            username: req.user.username
                        }
                    });
                    newFish.save();
                    foundAquarium.fish.push(newFish);
                }
                foundAquarium.save();
            }
        }
    });
   res.redirect("/aquariums/" + req.params.id);
});

module.exports = router;