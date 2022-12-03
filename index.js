var fs = require('fs');
var http = require('http');
var https = require('https');
const express = require("express");
// const { SocketAddress } = require("net");
const app = express();
var httpServer = http.createServer(app);
var privateKey  = fs.readFileSync('private.key', 'utf8');
var certificate = fs.readFileSync('primary.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

// const server = require("http").createServer(app);
const io = require("socket.io")(httpsServer)

// static file setting
    app.use(express.static("public"))

io.on("connection", (socket) => {
    socket.on("join", (roomname) => {
        const rooms = io.sockets.adapter.rooms;
        const room = rooms.get(roomname);
        if (room == undefined) {
            socket.join(roomname)
            socket.emit("created")
        }
        else if (room.size == 1) {
            socket.join(roomname)
            socket.emit("joined")
        }
        else {
            socket.emit("full")
        }
        socket.on("ready", (room) => {
            socket.to(room).emit("ready")
        })
        socket.on("offer", (offer, room) => {
            socket.to(room).emit("offer", offer)
        })
        socket.on("answer", (answer, room) => {
            socket.to(room).emit("answer", answer)
        })
        socket.on("candidate", (candidate, room) => {
            socket.to(room).emit("candidate", candidate)
        })
        socket.on("message",(data2)=>{
            socket.broadcast.emit('message',data2)
            console.log("its Work for sending",data2)
        })
    })
})
httpServer.listen(8080,()=>{
    console.log("server 8080 Running Properlly")
})

httpsServer.listen(8443,()=>{
    console.log("server 8443 Running Properlly")
})
























// ============ Single Slide Zooming Work ===================


// const socket = io();
// let localvideo = document.getElementById("local");
// const remotevideo = document.querySelector("#remote");




// // Zooming=0;
// // console.log("Zooming123:-"+Zooming);
// // const Zoomable=(" "+Zooming+Zooming1)

// let userStream;
// const url = new URL(location.href);
// const room = url.searchParams.get("roomname");
// let created = false;
// let rtcPeerConnection;

// let iceServers = {
//     iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun.services.mozilla.com:3478" }
//     ]
// }

// socket.emit("join", room)

// socket.on("created", () => {
//     created = true;
//     console.log(created);
//     navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//     }).then((stream) => {
//         userStream = stream;
//         localvideo.srcObject = stream;
//         localvideo.onloadedmetadata = () => {
//             localvideo.play()
//         }
//     })
// })

// socket.on("joined", () => {
//     created = false;
//     console.log(created);
//     navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true
//     }).then((stream) => {
//         userStream = stream;
//         localvideo.srcObject = stream;
//         localvideo.onloadedmetadata = () => {
//             localvideo.play()
//             socket.emit("ready", room)
//         }
//     })
// })
// socket.on("full", () => {
//     alert("room is full ")
// })

// socket.on("ready", () => {
//     if (created) {
//         rtcPeerConnection = new RTCPeerConnection(iceServers);
//         rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//         rtcPeerConnection.ontrack = onTrackFunction;
//         rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
//         rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
//         rtcPeerConnection.createOffer().then((offer) => {
//             rtcPeerConnection.setLocalDescription(offer)
//             socket.emit("offer", offer, room)

//         })
//     }
// })

// socket.on("offer", (offer) => {
//     if (!created) {
//         rtcPeerConnection = new RTCPeerConnection(iceServers);
//         rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//         rtcPeerConnection.ontrack = onTrackFunction;
//         rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
//         rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
//         rtcPeerConnection.setRemoteDescription(offer)
//         rtcPeerConnection.createAnswer().then((answer) => {
//             rtcPeerConnection.setLocalDescription(answer)
//             socket.emit("answer", answer, room)

//         })
//     }
// })
// socket.on("answer", (answer) => {
//     if (created) {
//         rtcPeerConnection.setRemoteDescription(answer)
//         console.log("its Work Answer")
//     }
// })

// socket.on('message',(data)=>{
    
//     let Zooming=document.querySelector('.slider');
//     console.log(data+" Recived data "+ Zooming.value);
//     Zooming.value=data;
    

//     let getdata=document.querySelector('input').innerHTML;
//     // const getdata=data;
//     console.log("getData:-",getdata);


// // =========******==Inside Try======*****=======
//         navigator.mediaDevices.getUserMedia({video: { zoom: true }})
//         .then(mediaStream => {
//             document.querySelector('.zooms').srcObject = mediaStream;
//             console.log("local Video Work inside message")
        
    
    
//         const [track] = mediaStream.getVideoTracks();
//         const capabilities = track.getCapabilities();
//         const settings = track.getSettings();

//         console.log("track:-"+track+" capabilities:-"+capabilities+" settings:-"+settings)

//         const input = Zooming;
//         console.log("input data inside message:-",input)



//     // Check whether zoom is supported or not.
//         // if (!('zoom' in settings)) {
//         //     return Promise.reject('Zoom is not supported by ' + track.label);
//         // }
//         console.log("without If Condition Work")
//     // Map zoom to a slider element.
//         input.min = capabilities.zoom.min;
//         input.max = capabilities.zoom.max;
//         input.step = capabilities.zoom.step;
//         input.value = settings.zoom;
//         console.log("input.value:-",input.value)
//         // input.value1 = capabilities.zoom.value;
//         // console.log("input.value:-",input.value1)
//         input.oninput = function(event) {
//             track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
//         }
//         input.hidden = false;
        
//         console.log("getData:-",getdata)
//         console.log("its Work Zoom in reciver",data)
//         })
// })



// // console.log("outside Use in get data:-",getdata + "input;-",input)

// socket.on("candidate", (candidate) => {
//     const Candidate = new RTCIceCandidate(candidate);
//     rtcPeerConnection.addIceCandidate(Candidate)
// })

// function OnIceCandidateFunction(event) {
//     if (event.candidate) {
//         socket.emit("candidate", event.candidate, room)
//     }
// }

// function onTrackFunction(event) {
//     remotevideo.srcObject = event.streams[0];
//     remotevideo.onloadeddata = () => {
//         remotevideo.play()
//     }
// }

// const zoomMessage = () => {
//    let Zoom1= document.querySelector('.zoom1');
//     // let messageinput = Zooming;
//     let message=Zoom1.value
//     socket.emit("message",message);
//     console.log("zoomMessage send instruction:-"+message); 
// }

// function openFullscreen() {
//     if (remotevideo.requestFullscreen) {
//         remotevideo.requestFullscreen();
//     } else if (remotevideo.webkitRequestFullscreen) { /* Safari */
//     remotevideo.webkitRequestFullscreen();
//     } else if (remotevideo.msRequestFullscreen) { /* IE11 */
//     remotevideo.msRequestFullscreen();
//     }
// }

// navigator.mediaDevices.getUserMedia({video: { zoom: true }})
// .then(mediaStream => {
//   document.querySelector('.zoom').srcObject = mediaStream;

//   const [track] = mediaStream.getVideoTracks();
//   const capabilities = track.getCapabilities();
//   const settings = track.getSettings();

//   console.log("track:-"+track+" capabilities:-"+capabilities+" settings:-"+settings)

//   const input = Zooming;
//   console.log("input navigation:-",input)

//   // Check whether zoom is supported or not.
//   if (!('zoom' in settings)) {
//     return Promise.reject('Zoom is not supported by ' + track.label);
//   }

//   // Map zoom to a slider element.
//   input.min = capabilities.zoom.min;
//   input.max = capabilities.zoom.max;
//   input.step = capabilities.zoom.step;
//   input.value = settings.zoom;
//   input.oninput = function(event) {
//     track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
//   }
//   input.hidden = false;
// })