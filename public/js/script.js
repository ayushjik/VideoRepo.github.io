const socket = io();
let localvideo = document.getElementById("local");
const remotevideo = document.querySelector("#remote");
let userStream;
const url = new URL(location.href);
const room = url.searchParams.get("roomname");
let created = false;
let rtcPeerConnection;
 
let iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.services.mozilla.com:3478" }
    ]
}

// if (created = true) {
//     let check=document.querySelector('#lslid');
//     console.log("check:-"+check);
// }else {
//     let check1=document.querySelector('#lslid').style.visibility='hidden';
//     console.log("check1:-"+check1);
// }

socket.emit("join", room)

socket.on("created", () => {
    created = true;
    console.log(created);
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        userStream = stream;
        localvideo.srcObject = stream;
        localvideo.onloadedmetadata = () => {
            localvideo.play()
            // recognizeFaces()
            if (created = true) {
                let check=document.querySelector('#lslid');
                let check2=document.querySelector('#lsli').style.visibility='hidden';
                console.log("check2:-"+check2);
                console.log("check:-"+check);
            }
            else {
                let check1=document.querySelector('#lslid').style.visibility='hidden';
                console.log("check1:-"+check1);
            }
        }
    })
})

socket.on("joined", () => {
    created = false;
    console.log(created);
    // remotevideo.src = '../videos/speech.mp4';
    // console.log('video added');
    // socket.emit("ready", room)
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        userStream = stream;
        localvideo.srcObject = stream;
        localvideo.onloadedmetadata = () => {
            localvideo.play()
            socket.emit("ready", room)
        // recognizeFaces()
        if (created = false) {
            let check=document.querySelector('#lslid');
            console.log("check:-"+check);
        }else {
            let check1=document.querySelector('#lslid').style.visibility='hidden';
            let check2=document.querySelector('#lsli').style.visibility='hidden';
            console.log("check1:-"+check1);
            console.log("check2:-"+check2);
        }
        }
    })
})

socket.on("full", () => {
    alert("room is full ")
})

socket.on("ready", () => {
    if (created) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = onTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection.createOffer().then((offer) => {
            rtcPeerConnection.setLocalDescription(offer)
            socket.emit("offer", offer, room)

        })
    }
})

socket.on("offer", (offer) => {
    if (!created) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = onTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream)
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection.setRemoteDescription(offer)
        rtcPeerConnection.createAnswer().then((answer) => {
            rtcPeerConnection.setLocalDescription(answer)
            socket.emit("answer", answer, room)

        })
    }
})

socket.on("answer", (answer) => {
    if (created) {
        rtcPeerConnection.setRemoteDescription(answer)
        console.log("its Work Answer")
    }
})

socket.on('message',(data)=>{
    let controlling=data/2;
    console.log(controlling)

    // document.getElementById("show").innerHTML=data;
    let Zooming=document.querySelector('.zoom1');
    Zooming.value=data*100 + 1;
    document.getElementById("show1").innerHTML=Zooming.value;
    console.log(data+" Recived data "+ Zooming.value);
    // Zooming=document.querySelector('.zoom1');
    // document.getElementById("show1").innerHTML=Zooming.value;
    track.applyConstraints({advanced: [ {zoom: Zooming.value} ]});

    console.log("track:-"+track);
})


socket.on("candidate", (candidate) => {
    const Candidate = new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(Candidate)
})

function OnIceCandidateFunction(event) {
    if (event.candidate) {
        socket.emit("candidate", event.candidate, room)
    }
}

function onTrackFunction(event) {
    remotevideo.srcObject = event.streams[0];
    remotevideo.onloadeddata = () => {
        remotevideo.play()
    }
}

// const zoomMessage = () => {
//    let Zoom1= document.querySelector('.zoom1');
//     // let messageinput = Zooming;
//     let message=Zoom1.value
//     // socket.emit("message",message);
//     console.log("zoomMessage send instruction:-"+message);    
// }

const zoomControl=()=>{
    let slider= document.querySelector('.slider');
    console.log("slider:-"+slider.value);
    // let zoomessa=slider.value;
    let zoomessa=slider.value;
    socket.emit("message",zoomessa);
    console.log("Zoom-Controll Work slider/min+max:-"+zoomessa);
}


function openFullscreen() {
    if (remotevideo.requestFullscreen) {
        remotevideo.requestFullscreen();
    } else if (remotevideo.webkitRequestFullscreen) { /* Safari */
    remotevideo.webkitRequestFullscreen();
    } else if (remotevideo.msRequestFullscreen) { /* IE11 */
    remotevideo.msRequestFullscreen();
    }
}



let [track] ="";
let capabilities =""; 
let settings ="";




navigator.mediaDevices.getUserMedia({video: { zoom: true }})
.then(mediaStream => {
  document.querySelector('.zoom').srcObject = mediaStream;

   [track] = mediaStream.getVideoTracks();
   capabilities = track.getCapabilities();
   settings = track.getSettings();

  console.log("track:-"+track+" capabilities:-"+capabilities+" settings:-"+settings);
  document.getElementById("show2").innerHTML=settings;
  const input = document.querySelector('.zoom1');
  console.log("input navigation:-"+input);

  // Check whether zoom is supported or not.
  if (!('zoom' in settings)) {
    return Promise.reject('Zoom is not supported by ' + track.label);
  }


  // Map zoom to a slider element.
  input.min = capabilities.zoom.min;
  input.max = capabilities.zoom.max;
  input.step = capabilities.zoom.step;
  input.value = settings.zoom;

  document.getElementById("show2").innerHTML= "Sh "+input.min + " " + input.max+" "+ input.step
  input.oninput = function(event) {
    track.applyConstraints({advanced: [ {zoom: event.target.value} ]});
    document.getElementById("show3").innerHTML= event.target.value +" Ayush";
  }
//   input.hidden = false;
})





















// =============*****======FACE RECOGNITION============************================

// const video = document.querySelector("#remote");
// console.log(video)

// Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//     faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//     faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//     faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//     faceapi.nets.ageGenderNet.loadFromUri("/models")
//   ]).then(startVideo);

//   function startVideo() {
//     navigator.mediaDevices.getUserMedia({
//         video: true,
//         // audio: true
//     }).then((stream) => {
//         userStream = stream;
//         video.srcObject = stream;
//         video.onloadedmetadata = () => {
//             video.play()
//     }
//     })
//   }
//   startVideo()

// Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('/models'), //heavier/accurate version of tiny face detector

//     // ======****===== Detector 2.0=======*********=========
//     faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//     faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//     faceapi.nets.ageGenderNet.loadFromUri("/models")
// ])
// .then(start)


// function start() {
//     document.body.append('Models Loaded');

    // navigator.mediaDevices.getUserMedia({
    //             video: {},
    //             // audio: true
    //         }).then((stream) => {
    //             userStream = stream;
    //             video.srcObject = stream;
    //             video.onloadedmetadata = () => {
    //                 video.play()
    //         }
    //         })

    // console.log("Work Outside")
    // socket.on("joined", () => {
    // created = false;
    // console.log("Work:-"+created);
    // navigator.mediaDevices.getUserMedia({
    //     video: true,
    //     audio: true
    // }).then((stream) => {
    //     userStream = stream;
    //     localvideo.srcObject = stream;
    //     localvideo.onloadedmetadata = () => {
    //         localvideo.play()
    //         socket.emit("ready", room)
    //     }
    // })
// })
    // video.src = '../videos/speech.mp4';
    // console.log('video added');
    // recognizeFaces();
// }


// async function recognizeFaces() {
//     const labeledDescriptors = await loadLabeledImages();
//     console.log("labeledDescription:-"+labeledDescriptors);
//     const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);
//     console.log("faceMatcher:-",faceMatcher)





//     video.addEventListener('play', async () => {
//         console.log('Playing');
//         const canvas = faceapi.createCanvasFromMedia(remotevideo);
//         document.body.append(canvas);

//         const displaySize = { width: video.width, height: video.height };
//         console.log("displaySize:-",displaySize)
//         faceapi.matchDimensions(canvas, displaySize);
//         setInterval(async () => {
//             const detections = await faceapi.detectAllFaces(remotevideo).withFaceLandmarks().withFaceDescriptors()
//             console.log("detections:-",detections);

//             const resizedDetections = faceapi.resizeResults(detections, displaySize);
//             console.log("resizedDetections:-",resizedDetections);

//             canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

//             const results = resizedDetections.map((d) => {
//                 return faceMatcher.findBestMatch(d.descriptor);
//             })
//             console.log("results:-",results);
            
//             results.forEach( (result, i) => {
//                 const box = resizedDetections[i].detection.box
//                 console.log("box:-",box);
                
//                 const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
//                 drawBox.draw(canvas);
//                 console.log("drawBox:-",drawBox);
//             })
//         }, 100)  
//     })
// }







// ==============*******======= 2.0 ==========**********================
//     localvideo.addEventListener("playing", () => {
//         const canvas = faceapi.createCanvasFromMedia(localvideo);
//         document.body.append(canvas);
    
//         const displaySize = { width: localvideo.width, height: localvideo.height };
//         console.log("displaySize:-",displaySize)
//         faceapi.matchDimensions(canvas, displaySize);
    
//         setInterval(async () => {
//         const detections = await faceapi
//             .detectAllFaces(localvideo, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceExpressions()
//             .withAgeAndGender();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//         console.log("resizedDetections:-",resizedDetections)
    
//         canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//         }, 100);
//     });
// }


// function loadLabeledImages() {
//     // const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor','Hulk']
//     const labels = ['Ayush'] // for WebCam
//     return Promise.all(
//         labels.map(async (label)=>{
//             const descriptions = []
//             for(let i=1; i<=2; i++) {
//                 const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`);
//                 const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//                 console.log(label + i + JSON.stringify(detections));
//                 descriptions.push(detections.descriptor);
//                 // console.log("descriptions.descriptor:-",label + i + JSON.stringify(detections.descriptor))
//             }
//             document.body.append(label+' Faces Loaded | ');
//             console.log("label:-",label)
//             return new faceapi.LabeledFaceDescriptors(label, descriptions);
//         })
//     )}