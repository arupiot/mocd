let mobilenet;
let video;
let label = '';
let myFont;
let facemesh;
let predictions = [];

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
  drawKeypoints();
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    // const keypoints = predictions[i].scaledMesh;
    const keypoints = predictions[i].mesh;
    // const keypoints = predictions[i];

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      // console.log(keypoints[j]);
      const [x, y] = keypoints[j];

      fill(255, 255, 255);
      ellipse(x, y, 3, 3);
    }
  }
}

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