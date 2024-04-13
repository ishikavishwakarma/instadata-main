const mongoose = require("mongoose");

const storySchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [
        {type: mongoose.Schema.Types.ObjectId, ref: "user"}
    ],
    data: String,
    storyimage:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("story", storySchema);