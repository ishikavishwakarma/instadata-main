var local = document.querySelector("#local")
navigator.getUserMedia =navigator.getUserMedia ||navigator.webkitGetUserMedia ||navigator.mozGetUserMedia ||navigator.msGetUserMedia;

navigator.getUserMedia(
    {
        audio:true,
        video:true
    },
    function(stream){
        local.srcObject=stream
    },
    function(error){
        alert("you cant access this")
    }
)