const chatusermodel = require("./routes/users");
const chatuser = require("./routes/chat");
const io = require("socket.io")();
const webSocketServer = require("ws").Server
const socketapi = {
  io: io,
};


// Add your socket.io logic here!
io.on("connection", async function (socket) {
  console.log("user connected");
  var token = socket.handshake.auth.token;
  await chatusermodel.findOneAndUpdate(
    { _id: token },
    { $set: { status: "1" } }
  );
  //user broadcast online status
  socket.broadcast.emit("online", { user_id: token });

  socket.on("disconnect", async function () {
    console.log("A user disconnected");
    var token = socket.handshake.auth.token;
    await chatusermodel.findOneAndUpdate(
      { _id: token },
      { $set: { status: "0" } }
    );
    socket.broadcast.emit("offline", { user_id: token });
  });
  socket.on("receiverchat", function (data) {
    socket.broadcast.emit("loadreceiverchat", data);
    // console.log(data);
  });

  socket.on("existschat", async function (data) {
    var chats = await chatuser.find({
      $or: [
        { senderid: data.senderid, receiverid: data.receiverid },
        { senderid: data.receiverid, receiverid: data.senderid },
      ],
    });
    socket.emit("loadchats", { chats });
  });
});
// end of socket.io logic

var wss =new webSocketServer({
  port:8080
})
var users = {}
wss.on("connection",function(conn){
  console.log("web user connected");

  conn.on("message",function(message){
    var data;
    try{
      data = JSON.parse(message)
    }catch(e){
      console.log(e);
    }

    switch(data.type){
      case "online":
        users[data.senderid] = conn
        conn.senderid=data.senderid

        sendtootheruser(conn,{
          type:"online",
          success:true,
        })
      break;

      case "offer":
        var connect = users[data.senderid]
        if(connect!=null){
          conn.otheruser=data.senderid
          sendtootheruser(connect,{
            type:"offer",
            offer:data.offer,
            senderid:conn.senderid
          })
        }
      break;

      case "answer":
        var connect = users[data.senderid]
        if(connect!=null){
          conn.otheruser=data.senderid
          sendtootheruser(connect,{
            type:"answer",
            answer:data.answer
          })
        }
      break
      case "candidate":
        var connect = users[data.senderid]
        if(connect!=null){
          sendtootheruser(connect,{
            type:"candidate",
            candidate:data.candidate
          })
        }
      break
    }


  })

  conn.on("close",function(){
    console.log("connection closed");

  })

})

function sendtootheruser(connection,message){
  connection.send(JSON.stringify(message));
}

module.exports = socketapi;
