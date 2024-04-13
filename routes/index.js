var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const commentModel = require("./comment");
const storyModel = require("./story");
const chatModel = require("./chat");
const fs = require("fs");
const passport = require("passport");
const path = require("path");
const multer = require("multer");
var flash = require("connect-flash");
const axios = require("axios");


const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/allposts");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/uploadpost",
  isLoggedIn,
  upload.single("image"),
  function (req, res, next) {
    // upload ho chuki hai data req.file mein hai
    userModel
      .findOne({ username: req.session.passport.user })
      .then(function (loggedinuser) {
        postModel
          .create({
            userid: loggedinuser._id,
            caption: req.body.caption,
            postimage: req.file.filename,
          })
          .then(function (post) {
            loggedinuser.posts.push(post._id);
            loggedinuser.save().then(function () {
              res.redirect("back");
            });
          });
      });
  }
);

//make a story upload rout
router.post(
  "/uploadstory",
  isLoggedIn,
  upload.single("createstory"),
  function (req, res, next) {
    // upload ho chuki hai data req.file mein hai
    userModel
      .findOne({ username: req.session.passport.user })
      .then(function (loggedinuser) {
        storyModel
          .create({
            userid: loggedinuser._id,
            storyimage: req.file ? req.file.filename : null,
            data: req.body.storydata,
          })
          .then(function (story) {
            loggedinuser.stories.push(story._id);
            loggedinuser.save().then(function () {
              res.redirect("back");
            });
          });
      });
  }
);

router.post(
  "/uploadpic",
  isLoggedIn,
  upload.single("pic"),
  function (req, res, next) {
    // upload ho chuki hai data req.file mein hai
    userModel
      .findOne({ username: req.session.passport.user })
      .then(function (loggedinuser) {
        if (loggedinuser.image !== "default.jpg") {
          fs.unlinkSync(`./public/images/allposts/${loggedinuser.image}`);
        }
        loggedinuser.image = req.file.filename;
        loggedinuser.save().then(function () {
          res.redirect("back");
        });
      });
  }
);

router.get("/profile/:id", isLoggedIn, function (req, res, next) {
  userModel
    .findOne({ username: req.session.passport.user })
    .populate("following")
    .then(function (loggedinuser) {
      userModel
        .find({ username: { $ne: req.session.passport.user } })
        .then(function (allusers) {
          userModel
            .findOne({ _id: req.params.id })
            .populate("posts")
            .populate("followers")
            .populate("following")
            .then(function (publicuser) {
              res.render("publicprofile", {
                publicuser,
                allusers,
                loggedinuser,
              });
            });
        });
    });
});

//make a delete post rout
router.get("/delete/:id", isLoggedIn, function (req, res) {
  postModel.findByIdAndDelete({ _id: req.params.id }).then(function () {
    res.redirect("back");
  });
});



// Unarchive route
router.get("/unarchieve/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      // Use pull method to remove the post id from the archive array
      loggedinuser.archieve.pull(req.params.id);

      // Save the user
      loggedinuser
        .save()
        .then(() => {
          res.redirect("back");
        })
        .catch((error) => {
          console.error("Error:", error);
          res.status(500).send("Internal Server Error");
        });
    });
});

router.get("/follow/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      userModel.findOne({ _id: req.params.id }).then(function (founuser) {
        if (loggedinuser.following.indexOf(founuser._id) === -1) {
          loggedinuser.following.push(founuser._id);
        } else {
          // loggedinuser.following.pull(founuser._id);
        }
        loggedinuser.save().then(function () {
          if (founuser.followers.indexOf(loggedinuser._id) === -1) {
            founuser.followers.push(loggedinuser._id);
          } else {
            // founuser.followers.pull(loggedinuser._id);
          }
          founuser.save().then(function () {
            res.redirect("back");
          });
        });
      });
    });
});
//make a unfollow rout
router.get("/unfollow/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      userModel.findOne({ _id: req.params.id }).then(function (founuser) {
        if (loggedinuser.following.indexOf(founuser._id) !== -1) {
          loggedinuser.following.pull(founuser._id);
        }
        loggedinuser.save().then(function () {
          if (founuser.followers.indexOf(loggedinuser._id) !== -1) {
            founuser.followers.pull(loggedinuser._id);
          }
          founuser.save().then(function () {
            res.redirect("back");
          });
        });
      });
    });
});

router.get("/archieve/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      postModel.findOne({ _id: req.params.id }).then(function (postid) {
        const archieveIndex = loggedinuser.archieve.indexOf(postid._id);

        if (archieveIndex !== -1) {
          // If postid._id is in archieve, remove it
          loggedinuser.archieve.splice(archieveIndex, 1);
        } else {
          // If postid._id is not in archieve, add it
          loggedinuser.archieve.push(postid._id);
        }

        // Save both the user and the post
        Promise.all([loggedinuser.save(), postid.save()])
          .then(() => {
            res.redirect("back");
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
          });
      });
    });
});

router.get("/remove/:id", isLoggedIn, function (req, res) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      userModel.findOne({ _id: req.params.id }).then(function (founuser) {
        if (loggedinuser.followers.indexOf(founuser.id) !== -1) {
          loggedinuser.followers.pull(founuser.id);
        }
        loggedinuser.save().then(function () {
          if (founuser.following.indexOf(loggedinuser._id) !== -1) {
            founuser.following.pull(loggedinuser._id);
          }
          founuser.save().then(function () {
            res.redirect("back");
          });
        });
      });
    });
});




router.post("/comment/:postid", isLoggedIn, function (req, res, next) {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (loggedinuser) {
      postModel.findOne({ _id: req.params.postid }).then(function (post) {
        commentModel
          .create({
            userid: loggedinuser._id,
            postid: post._id,
            comment: req.body.comment,
          })
          .then(function (comment) {
            post.comments.push(comment._id);
            post.save().then(function () {
              // Send the new comment data and previous URL as a response
              res.json({
                success: true,
                comment: {
                  _id: comment._id,
                  userid: {
                    _id: loggedinuser._id,
                    image: loggedinuser.image,
                  },
                  postid: post._id,
                  comment: req.body.comment,
                  commentscount: post.comments.length
                },
                prevUrl: req.headers.referer, // Store the previous URL and send it in the response
              });
            })
            .catch(function (err) {
              // Handle errors
              console.error(err);
              res.status(500).json({ success: false, error: "Internal Server Error" });
            });
          });
      });
    })
    .catch(function (err) {
      // Handle errors
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
});





router.post("/like/:postid", isLoggedIn, async function (req, res, next) {
  try {
    const loggedinuser = await userModel.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.findOne({ _id: req.params.postid });

    if (post.likes.includes(loggedinuser._id)) {
      post.likes.pull(loggedinuser._id);
    } else {
      post.likes.push(loggedinuser._id);
    }

    await post.save();

    res.json({
      isLiked: post.likes.includes(loggedinuser._id),
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error handling like:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/explore", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("followRequests")
        // .populate("following")

        .then(function (loggedinuser) {
          postModel
            .find()
            .populate("userid")
            .then(function (allposts) {
              res.render("explorecopy", { allposts, loggedinuser, allusers });
            });
        });
    });
});

router.get("/reel", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("followRequests")
        // .populate("following")
        .then(function (loggedinuser) {
          console.log(loggedinuser);
          postModel
            .find()
            .populate("userid")
            .then(function (allposts) {
              // Filter posts by mp4 format
              const mp4Posts = allposts.filter((post) => {
                const fileExtension = post.postimage
                  .split(".")
                  .pop()
                  .toLowerCase();
                return fileExtension === "mp4" || fileExtension === "mkv";
              });
              // Map post IDs to an array
              const postIds = allposts.map((post) => post._id);
              // Find comments associated with these posts
              commentModel
                .find({ postid: { $in: postIds } })
                .populate("userid")
                .then(function (allcomments) {
                  res.render("reel", {
                    mp4Posts,
                    loggedinuser,
                    allcomments,
                    allusers,
                  });
                });
            });
        });
    });
});



router.get("/removeCurrentPhoto", isLoggedIn, (req, res) => {
  userModel
    .findOne({ username: req.session.passport.user })
    .then(function (user) {
      user.image = "default.jpg";
      user.save();
      res.redirect("back");
    });
});

router.post("/edit", isLoggedIn, function (req, res, next) {
  userModel
    .findOneAndUpdate(
      { username: req.session.passport.user },
      {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        bio: req.body.bio,
      },
      { new: true }
    )
    .then(function (updateduser) {
      req.login(updateduser, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/profile");
      });
    });
});

router.get("/stories/:id", isLoggedIn, function (req, res, next) {
  userModel
    .findOne({ _id: req.params.id })
    .populate({
      path: "stories",
      match: { date: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    })
    .then(function (user) {
      if (!user) {
        return res.status(404).send("User not found");
      }
      const userstory = user.stories;
      if (!userstory || userstory.length === 0) {
        return res.status(404).send("User has no recent stories");
      }
      res.render("stories", { userstory, user });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

router.get('/deleteRequest/:id', async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    const loggedinuser = await userModel.findOne({ username: req.session.passport.user })
    if (!user || !loggedinuser) {
      return res.status(404).send('User not found');
    }
    loggedinuser.followRequests.pull(user._id);
    await loggedinuser.save();
    res.redirect('back');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/sendFollowRequest/:userId', (req, res) => {
  const userId = req.params.userId;
  userModel.findById(userId)
      .then(user => {
          if (!user) {
              return res.status(404).send('User not found');
          }
          user.followRequests.push(req.user._id);
          user.save()
              .then(() => {
                  res.redirect("back");
              })
              .catch(err => {
                  console.error(err);
                  res.status(500).send('Internal Server Error');
              });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});

router.get('/unsendFollowRequest/:userId', (req, res) => {
  const userId = req.params.userId;
  userModel.findById(userId)
      .then(user => {
          if (!user) {
              return res.status(404).send('User not found');
          }
          user.followRequests.pull(req.user._id);
          user.save()
              .then(() => {
                  res.redirect("back");
              })
              .catch(err => {
                  console.error(err);
                  res.status(500).send('Internal Server Error');
              });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Internal Server Error');
      });
});


router.get('/approveFollowRequest/:requesterId', async (req, res) => {
  try {
    const requesterId = req.params.requesterId;

    const user = await userModel.findById(req.user._id);
    const requester = await userModel.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).send('User not found');
    }

    // Remove requesterId from followRequests
    user.followRequests.pull(requesterId);

    // Add requesterId to followers of the current user
    user.followers.push(requesterId);

    // Add current user's ID to following of the requester
    requester.following.push(req.user._id);

    await user.save();
    await requester.save();

    res.redirect('back');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/home", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")
        .populate("followRequests")
        // .populate("following")
        .then(function (loggedinuser) {
          const followinguser = loggedinuser.following.map((user) => user._id);
          postModel
            .find({ userid: { $in: followinguser } })
            .populate("userid")
            .then(function (allposts) {
              postModel
                .find({
                  $and: [
                    { userid: { $ne: loggedinuser._id } }, // Exclude posts from the logged-in user
                    { userid: { $nin: followinguser } }, // Exclude posts from users who follow the logged-in user
                  ],
                })
                .populate("userid")
                .then(function (notfollowedposts) {
                  const postIds = allposts.map((post) => post._id);
                  const notpostIds = allposts.map((notpost) => notpost._id);
                  commentModel
                    .find({ postid: { $in: postIds } })
                    .populate("userid")
                    .then(function (allcomment) {
                      commentModel
                        .find({ postid: { $nin: notpostIds } })
                        .populate("userid")
                        .then(function (notfollowedcomment) {
                          commentModel
                            .find({ postid: { $in: loggedinuser.posts } })
                            .populate("userid")
                            .then(function (loggedinuserComments) {
                              // Combine comments from both sets
                              const allcomments = [
                                ...allcomment,
                                ...loggedinuserComments,
                                ...notfollowedcomment,
                              ];
                              storyModel
                                .find({
                                  date: {
                                    $gt: new Date(
                                      Date.now() - 24 * 60 * 60 * 1000
                                    ),
                                  },
                                })
                                .populate("userid")
                                .then(function (allstories) {
                                  res.render("home", {
                                    allposts,
                                    allstories,
                                    loggedinuser,
                                    allcomments,
                                    allusers,
                                    notfollowedposts,
                                  });
                                });
                            });
                        });
                    });
                });
            });
        });
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")
        .populate("followers")
        .populate("archieve")
        .populate("followRequests")
        .populate("following")
        .then(function (loggedinuser) {
          res.render("profile", { loggedinuser, allusers });
        });
    });
});

router.get("/comment", isLoggedIn, function (req, res, next) {
  postModel
    .find()
    .populate("comments")
    .then(function (founduser) {
      res.send(founduser);
    });
});




router.get("/edit", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")
        .populate("followRequests")
        .then(function (loggedinuser) {
          res.render("edit", { loggedinuser, allusers });
        });
    });
});



router.get("/account", isLoggedIn, function (req, res, next) {
  userModel
    .find({ username: { $ne: req.session.passport.user } })
    .then(function (allusers) {
      userModel
        .findOne({ username: req.session.passport.user })
        .populate("posts")
        .populate("followRequests")
        .then(function (loggedinuser) {
          res.render("private", { loggedinuser, allusers });
        });
    });
});

router.get('/updateprivate', isLoggedIn, function (req, res, next) {
  const username = req.session.passport.user;
  userModel.findOneAndUpdate(
    { username: username },
    { $set: { private: true } }, // Set the 'private' field to true
    { new: true } // Return the updated document
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.redirect('back');
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((err) => {
      console.error(`Error updating user ${username}:`, err);
      res.status(500).send('Internal Server Error');
    });
});
router.get('/removeprivate', isLoggedIn, function (req, res, next) {
  const username = req.session.passport.user;
  userModel.findOneAndUpdate(
    { username: username },
    { $set: { private: false } }, // Set the 'private' field to true
    { new: true } // Return the updated document
  )
    .then((updatedUser) => {
      if (updatedUser) {
        res.redirect('back');
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch((err) => {
      console.error(`Error updating user ${username}:`, err);
      res.status(500).send('Internal Server Error');
    });
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login", // Corrected from failuredRedirect to failureRedirect
    failureFlash: true,
  }),
  function (req, res, next) {}
);

router.post("/register", async function (req, res, next) {
  try {
    const foundUser = await userModel.findOne({ username: req.body.username });

    if (foundUser) {
      // User with the same username already exists
      return res.send("Username already exists");
    }

    // Create a new user
    const newUser = new userModel({
      email: req.body.email,
      username: req.body.username,
      name: req.body.name,
    });

    // Register the new user
    const registeredUser = await userModel.register(newUser, req.body.password);

    // Authenticate the user
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/profile");
    });
  } catch (error) {
    console.error("Error in registration:", error.message);
    return res.status(500).send("Internal Server Error");
  }
});


router.get("/", function (req, res, next) {
  res.render("index");
});


router.get("/call/:id", function (req, res, next) {
  userModel.findOne({_id:req.params.id})
  .then(function(receiverid) {
    userModel.findOne({ username: req.session.passport.user })
    .then(function(loggedinuser){
      res.render("call",{receiverid,loggedinuser})
    })
  })
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.get("/message", isLoggedIn, function (req, res, next) {
  userModel
    .findOne({ username: req.session.passport.user })
    // .populate("following")
    .populate("followRequests")
    .then(function (loggedinuser) {
      userModel
        .find({ username: { $ne: req.session.passport.user } })
        .then(function (allusers) {
          res.render("message", { allusers, loggedinuser });
        });
    })
    .catch(function (error) {
      console.error("Error finding users:", error);
      // Handle the error and send an appropriate response
      res.status(500).send("Internal Server Error");
    });
});

router.post("/chat", async function (req, res, next) {
  try {
    const senderUser = await userModel.findById(req.body.senderid);
    if (!senderUser) {
      return res.json({ success: false, error: "Sender user not found" });
    }
    const chat = new chatModel({
      senderid: req.body.senderid,
      receiverid: req.body.receiverid,
      message: req.body.message,
    });
    const newchat = await chat.save();
    res.json({
      success: true,
      data: {
        chatId: newchat._id,
        message: newchat,
        senderImage: senderUser.image,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
