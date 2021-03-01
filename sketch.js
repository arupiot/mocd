let mobilenet;
let video;
let label = '';
let myFont;
let facemesh;
let predictions = [];
let aspectX = 1.0;
let aspectY = 1.0;

const devices = [];

function preload() {
  myFont = loadFont('fonts/NotoSansCJKjp-Regular.otf');
}

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  console.log('ml5 version:', ml5.version);
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
  // image(video, 0, 0);
  drawKeypoints();
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
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
    const h = -(bbox.topLeft[0][1]-bbox.bottomRight[0][1])
    // const keypoints = predictions[i];

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      // console.log(keypoints[j]);
      
      const [x, y] = keypoints[j];

      fill(255, 255, 255);

      // ellipse(x+tx, y+ty, 3, 3);
      // rect(bbox.topLeft[0][0], bbox.topLeft[0][1], w, h);
      ellipse(x*aspectX, y*aspectY, 3, 3);
      noFill();
      rect(bbox.topLeft[0][0]*aspectX, bbox.topLeft[0][1]*aspectX, w*aspectX, h*aspectY);
    }
  }
}

/*
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

function windowResized() {
  aspectX = windowWidth / video.width;
  aspectY = windowHeight / video.height;
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 70) {
    let fs = fullscreen();
    fullscreen(!fs);
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