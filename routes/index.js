var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Aquarium = require("../models/aquarium"),
    User = require("../models/user");  
    
// Show Landing Form
router.get("/", function(req, res) {
    Aquarium.count().exec(function(err, count) {
        if (err) {
           console.log(err);
        } else {
           var random = Math.floor(Math.random() * count);
           Aquarium.findOne().skip(random).exec(function(err, foundAquarium) {
                if (err) {
                   console.log(err);
                } else {
                   res.render("landing", {aquarium : foundAquarium});
                }
            });
        }
    } 
)});


// Show Register Form
router.get("/register", function(req, res) {
    res.render("register");
});

// Register Logic
router.post("/register", function(req, res) {
   var newUser = new User({
       username: req.body.username
   });
   User.register(newUser, req.body.password, function(err, user) {
       if (err) {
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function() {
           req.flash("success", user.username + " was registered successfully");
           res.redirect("/aquariums");           
       });
   });
});

// Show Login Form
router.get("/login", function(req, res) {
    res.render("login"); 
});

// Authenticate Login
router.post("/login", passport.authenticate("local", {
       successRedirect: "/aquariums",
       failureRedirect: "/login"
    }), function(req, res) {
});

// Logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged out successfully");
   res.redirect("/aquariums");
});

module.exports = router;