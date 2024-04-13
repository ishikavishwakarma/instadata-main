const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    senderid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiverid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message:{
        type:String,
        required:true
    }
    
},{ timestamp:true })

module.exports = mongoose.model("chat", chatSchema);