var Aquarium = require("../models/aquarium"),
    Comment = require("../models/comment"),
    ObjectId = require('mongoose').Types.ObjectId,
    middlewareObj = {};
    
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkAquariumOwnership = function checkAquariumOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
            if (err) {
                req.flash("error", "Aquarium not found!");
                res.redirect("back");
            } else {
                if (foundAquarium.owner.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't own this aquarium and do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(new ObjectId(req.params.comment_id), function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You did not submit this comment and cannot modify it");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;