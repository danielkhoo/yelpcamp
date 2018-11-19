var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/",function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        // Comment.create(req.body.comment, function(err, comment){
        //    if(err){
        //        console.log(err);
        //    } else {
        //        //add username and id to comment
        //        comment.author.id = ObjectId("5bc45e7f642eb2069f9a32ed");//req.user._id;
        //        comment.author.username = "daniel";//req.user.username;
        //        //save comment
        //        comment.save();
        //        console.log("\n\n\n");
        //        console.log(campground.comments);
        //        campground.comments.push(comment);
        //        console.log(campground.comments);
        //        campground.save();
        //        //console.log(comment);
        //        req.flash('success', 'Created a comment!');
        //        res.redirect('/campgrounds/' + campground._id);
        //    }
        // });
        Comment.create(
            {
                text: "This place is great, but I wish there was internet",
                author: "Homer"
            }, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment");
                }
            });
            res.redirect('/campgrounds/' + campground._id);
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;