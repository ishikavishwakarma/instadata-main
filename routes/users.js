const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// const dburl ="mongodb+srv://sunny:dybXmdMBJ2EhWDf7@cluster0.st61i.mongodb.net/?retryWrites=true&w=majority"
const dburl = "mongodb://127.0.0.1:27017/sunnyinstagram"

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(dburl, connectionParams)
  .then(() => {
    console.log("Connected to MongoDB Atas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err.message);
  });
const userSchema = mongoose.Schema(
  {
    email: String,
    name: String,
    username: String,
    password: String,
    bio: {
      type: String,
      default: "Tell me about Yourself ❤️",
    },
    image: {
      type: String,
      default: "default.jpg",
    },
    status: {
      type: String,
      default: "0",
    },
    private: { 
      type: Boolean, 
      default: false 
    },
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    archieve: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "story" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
