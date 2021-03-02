let mobilenet;
let video;
let label = '';
let myFont;
let facemesh;
let predictions = [];
let aspectX = 1.0;
let aspectY = 1.0;
let poseNet;

let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;
let eyerX = 0;
let eyerY = 0;
let earlX = 0;
let earlY = 0;
let earrX = 0;
let earrY = 0;

const devices = [];

let showBBox = true;
let showDots = true;
let showPolygons = true;

function preload() {
  myFont = loadFont('fonts/NotoSansCJKjp-Regular.otf');
}

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  console.log('Using ml5 version:', ml5.version);
  createCanvas(windowWidth, windowHeight);
  // let fs = fullscreen();
  //   fullscreen(!fs);
  navigator.mediaDevices.enumerateDevices().then(gotDevices);
  video = createCapture(VIDEO);
  aspectX = windowWidth / video.width;
  aspectY = windowHeight / video.height;
  console.log(aspectX, aspectY);
  // video.size(width, height);
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", results => {
    predictions = results;
  });
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  video.hide();
  background(0);
  // mobilenet = ml5.imageClassifier('MobileNet', video, modelReady);
  fill('#ED225D');
  textFont(myFont);
  textSize(36);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  filter(GRAY);
  // image(video, 0, 0);
  drawKeypoints();
  fill(255);
  textSize(32);
  text(label, 10, height - 20);

  if (showPolygons === true) {
    drawFaceFeatures();
  }
  
}

function drawFaceFeatures() {
  let d = dist(noseX, noseY, eyelX, eyelY);

  stroke(255);
  fill(255, 0, 0);
  ellipse(noseX*aspectX, noseY*aspectY, d);

  fill(0,0,255);
  ellipse(eyelX*aspectX, eyelY*aspectY, d);

  fill(0,0,255);
  ellipse(eyerX*aspectX, eyerY*aspectY, d);

}


// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  aspectX = windowWidth / video.width;
  aspectY = windowHeight / video.height;
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;
    // const keypoints = predictions[i].mesh;
    // const keypoints = predictions[i].annotations.silhouette;
    const bbox = predictions[i].boundingBox;
    const sections = predictions[i].annotations;
    // console.log(sections);
    // console.log(bbox.bottomRight[0][0],);
    const tx = (bbox.bottomRight[0][0]+bbox.topLeft[0][0])/2;
    const ty = (bbox.topLeft[0][1]+bbox.bottomRight[0][1])/2;
    const w = bbox.bottomRight[0][0]-bbox.topLeft[0][0]
    const h = bbox.topLeft[0][1]-bbox.bottomRight[0][1]
    // const keypoints = predictions[i];

    // Draw facial keypoints
    for (let j = 0; j < keypoints.length; j += 1) {
      // console.log(keypoints[j]);
      
      const [x, y] = keypoints[j];

      if (showDots === true) {
        stroke(0, 0, 0)
        fill(255, 255, 255);

        // ellipse(x+tx, y+ty, 3, 3);
        // rect(bbox.topLeft[0][0], bbox.topLeft[0][1], w, h);
        ellipse(x*aspectX, y*aspectY, 5, 5);
      }
      
      if (showBBox === true) {
        noFill();
        stroke(255, 0, 0);
        rect(bbox.topLeft[0][0]*aspectX, bbox.topLeft[0][1]*aspectX, w*aspectX, -h*aspectY);
      }
    }
  }
}

/*
mobilenet
leftCheek: 
leftEyeLower0: 
leftEyeLower1: 
leftEyeLower2: 
leftEyeLower3: 
leftEyeUpper0: 
leftEyeUpper1: 
leftEyeUpper2: 
leftEyebrowLower: 
leftEyebrowUpper: 
lipsLowerInner: 
lipsLowerOuter: 
lipsUpperInner: 
lipsUpperOuter: 
midwayBetweenEyes: 
noseBottom: 
noseLeftCorner: 
noseRightCorner: 
noseTip: 
rightCheek: 
rightEyeLower0: 
rightEyeLower1: 
rightEyeLower2: 
rightEyeLower3: 
rightEyeUpper0: 
rightEyeUpper1: 
rightEyeUpper2: 
rightEyebrowLower: 
rightEyebrowUpper: 
silhouette: 
*/

/*
posenet
leftAnkle: 
leftEar: 
leftElbow: 
leftEye: 
leftHip: 
leftKnee:
leftShoulder: 
leftWrist: 
nose: 
rightAnkle: 
rightEar: 
rightElbow: 
rightEye: 
rightHip: 
rightKnee: 
rightShoulder:
rightWrist: 
*/

function modelReady() {
  console.log('Model is ready!!!');
  // mobilenet.predict(gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    // console.log(results);
    label = results[0].className;
    // mobilenet.predict(gotResults);
  }
}

function gotDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind == 'videoinput') {
      devices.push({
        label: deviceInfo.label,
        id: deviceInfo.deviceId
      });
    }
  }
  console.log(devices);
  let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  console.log(supportedConstraints);
  var constraints = {
    video: {
      deviceId: {
        exact: devices[0].id
      },
    }
  };
  createCapture(constraints);
}

function gotPoses(poses) {
  // console.log(poses);
  // run detection on at least one pose
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let elX = poses[0].pose.keypoints[1].position.x;
    let elY = poses[0].pose.keypoints[1].position.y;
    let erX = poses[0].pose.keypoints[2].position.x;
    let erY = poses[0].pose.keypoints[2].position.y;
    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, elX, 0.5);
    eyelY = lerp(eyelY, elY, 0.5);
    eyerX = lerp(eyerX, erX, 0.5);
    eyerY = lerp(eyerY, erY, 0.5);
  }
}

function windowResized() {
  aspectX = windowWidth / video.width;
  aspectY = windowHeight / video.height;
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 70) {
    let fs = fullscreen();
    fullscreen(!fs);
  } else if (keyCode === 66) {
    showBBox = !showBBox;
    console.log("show bbox: ", showBBox);
  } else if (keyCode === 80) {
    showPolygons = !showPolygons;
    console.log("show polygons: ", showPolygons);
  } else if (keyCode === 68) {
    showDots = !showDots;
    console.log("show dots: ", showDots);
  }
}

// function mousePressed() {
//   if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
//     let fs = fullscreen();
//     fullscreen(!fs);
//   }
// }

// function imageReady() {
//   image(puffin, 0, 0, width, height);
// }