// navigator.mediaDevices.getUserMedia({video: true})
// .then(mediaStream => {
//   document.querySelector('.Local').srcObject = mediaStream;

// const [track] = mediaStream.getVideoTracks();
// const capabilities = track.getCapabilities();
// const settings = track.getSettings();

// const input = document.querySelector('input[type="range"]');
// console.log("track:-"+track+"capabilities:-"+capabilities+"settings:-"+settings+ "input:-"+input)
// // Check whether zoom is supported or not.
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



// navigator.mediaDevices.getUserMedia({video: true})
// .then(mediaStream => {
//   document.querySelector('.Remote').srcObject = mediaStream;

// const [track] = mediaStream.getVideoTracks();
// const capabilities = track.getCapabilities();
// const settings = track.getSettings();

// const input = document.querySelector('input[type="range"]');
// console.log("track:-"+track+"capabilities:-"+capabilities+"settings:-"+settings+ "input:-"+input)
// // Check whether zoom is supported or not.
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

// const socket = io()


const remotevideo=document.querySelector('.Remote')
let userStream;
const url = new URL(location.href);
const room = url.searchParams.get("roomname")

let created = false;
let rtcPeerConnection;
let iceServers = {
  iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun.services.mozilla.com:3478" }
  ]
}
socket.emit("join", room)


socket.on("created", () => {
  created = true;
  console.log(created);
  navigator.mediaDevices.getUserMedia({video: true})
  .then(mediaStream => {
  document.querySelector('.Local').srcObject = mediaStream;

  if (created) {
    rtcPeerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.createOffer().then((offer) => {
      rtcPeerConnection.setLocalDescription(offer)
      socket.emit("joined",offer, room)
      }),console.log("RtcWork Local:-",rtcPeerConnection)
    }
  })
  })


socket.on("joined", (offer) => {
  created = false;
  console.log(created);
  navigator.mediaDevices.getUserMedia({video: { zoom: true }})
  .then(mediaStream => {
    remotevideo.srcObject = mediaStream;


  const [track] = mediaStream.getVideoTracks();
  const capabilities = track.getCapabilities();
  const settings = track.getSettings();

  const input = document.querySelector('input[type="range"]');
  console.log("track:-"+track+" capabilities:-"+capabilities+" settings:-"+settings+" input:-"+input)

if (!created) {
  rtcPeerConnection = new RTCPeerConnection(iceServers);
  rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
    rtcPeerConnection.setRemoteDescription(offer)
    rtcPeerConnection.createAnswer().then((answer) => {
      rtcPeerConnection.setLocalDescription(answer)
      socket.emit("answer",answer, room)
    }),console.log("RtcWork Remote:-",rtcPeerConnection)
  }
  else if(!('zoom' in settings)) {
      return Promise.reject('Zoom is not supported by ' + track.label);
    }

  // Check whether zoom is supported or not.
  // if (!('zoom' in settings)) {
  //   return Promise.reject('Zoom is not supported by ' + track.label);
  // }


  // Map zoom to a slider element.
  input.min = capabilities.zoom.min;
  input.max = capabilities.zoom.max;
  input.step = capabilities.zoom.step;
  input.value = settings.zoom;
  input.oninput = function(event) {
    track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
  }
  input.hidden = false;
  })
})


socket.on("full", () => {
  alert("room is full ")
})


// socket.on("ready", () => {
//   if (created) {
//       rtcPeerConnection = new RTCPeerConnection(iceServers);
//       rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//       rtcPeerConnection.onaddstream = handleRemoteStreamAdded
//       rtcPeerConnection.onremovestream = handleRemoteStreamRemoved;
      // rtcPeerConnection.ontrack = onTrackFunction;
      // rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
      // rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
//       rtcPeerConnection.createOffer().then((offer) => {
//           rtcPeerConnection.setLocalDescription(offer)
//           socket.emit("offer", offer, room)
//       }),console.log("READY:-",rtcPeerConnection)
//     }
// })

// socket.on("offer", (offer) => {
//   if (!created) {
//       rtcPeerConnection = new RTCPeerConnection(iceServers);
//       rtcPeerConnection.onicecandidate = handleIceCandidate;
//       rtcPeerConnection.onaddstream = handleRemoteStreamAdded
//       rtcPeerConnection.onremovestream = handleRemoteStreamRemoved;
      // rtcPeerConnection.ontrack = onTrackFunction;
      // rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
      // rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
//       rtcPeerConnection.setRemoteDescription(offer)
//       rtcPeerConnection.createAnswer().then((answer) => {
//           rtcPeerConnection.setLocalDescription(answer)
//           socket.emit("answer", answer, room)
//       console.log("offer=",rtcPeerConnection)
//       })
//     }
// })

socket.on("answer", (answer) => {
  if (created) {
      rtcPeerConnection.setRemoteDescription(answer)
  console.log("Answer is Work")
  }
})

socket.on("candidate", (candidate) => {
  const Candidate = new RTCIceCandidate(candidate);
  rtcPeerConnection.addIceCandidate(Candidate)
  console.log("Candidate:-",Candidate)
})

function OnIceCandidateFunction(event) {
  if (event.candidate) {
      socket.emit("candidate", event.candidate, room)
      console.log("OnIceCandidateFunction",room)
  }
}

// function onTrackFunction(event) {
//   remotevideo.srcObject = event.streams[0];
//   remotevideo.onloadeddata = () => {
//       remotevideo.play()
//       console.log("onTrackFunction")
//   }
// }

// function handleIceCandidate(event) {
//   if (event.candidate) {
//           socket.emit("candidate", event.candidate, room)
//           console.log("OnIceCandidateFunction",room)
//       }
// }

// function handleRemoteStreamAdded(event) {
//   remoteStream = event.stream;
//   remotevideo.srcObject = remoteStream;
//   console.log("add function Work")
// }

// function handleRemoteStreamRemoved(event) {
//   remotevideo.srcObject = null;
//   localVideo.srcObject = null;
//   console.log("Remove function Work")
// }


