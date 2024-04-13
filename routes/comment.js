const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    comment:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("comment", commentSchema);