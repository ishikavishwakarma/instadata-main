const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ],
    comments: [
        {type: mongoose.Schema.Types.ObjectId, ref: "comment"}
    ],
    postimage:{
        type:String
    },
    caption:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("post", postSchema);