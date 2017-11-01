var express = require("express"),
router = express.Router({mergeParams: true}),
ObjectId = require('mongoose').Types.ObjectId,
Aquarium = require("../models/aquarium"),
Comment = require("../models/comment"),
middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            req.flash("error", "Aquarium not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {aquarium: foundAquarium});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            req.flash("error", "Aquarium not found");
            res.redirect("back");
        } else {
            var newComment = new Comment({
                text: req.body.comment,
                date: new Date(),
                author: {
                    id: req.user._id,
                    username: req.user.username
                }
            });
            newComment.save();
            foundAquarium.comments.push(newComment);
            foundAquarium.save();
        }
    });
    req.flash("success", "Comment added successfully");
    res.redirect("/aquariums/" + req.params.id);
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Aquarium.findById(new ObjectId(req.params.id), function(err, foundAquarium) {
        if (err) {
            req.flash("error", "Aquarium not found");
            res.redirect("back");
        } else {
            Comment.findById(new ObjectId(req.params.comment_id), function(err, foundComment) {
                if (err) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {
                        aquarium: foundAquarium,
                        comment: foundComment
                    });
                }
            });
        }
    });
});

router.put("/:comment_id/", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(new ObjectId(req.params.comment_id), function(err, foundComment) {
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        } else {
            foundComment.text = req.body.comment;
            foundComment.save();
            res.redirect("/aquariums/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(new ObjectId(req.params.comment_id), function(err) {
       if (err) {
           console.log(err);
       } else {
           req.flash("success", "Comment was deleted");
           res.redirect("/aquariums/" + req.params.id);
       }
    });
});

module.exports = router;