let video = null;
let detector = null;
let detections = [];
let videoVisibility = true;
let detecting = false;

const toggleVideoEl = document.getElementById("toggleVideoEl");
const toggleDetectingEl = document.getElementById("toggleDetectingEl");

// The preload() function if existed is called before the setup() function
function preload() {
  // create detector object from "cocossd" model
  detector = ml5.objectDetector('cocossd');
  console.log('detector object is loaded');
}

// The setup() function is called once the program starts.
function setup() {
  // create canvas element with 640 width and 480 height in pixel
  createCanvas(640, 480);
  // Creates a new HTML5 <video> element that contains the audio/video feed from a webcam.
  // The element is separate from the canvas and is displayed by default.
  video = createCapture(VIDEO);
  video.size(640, 480);
  console.log('video element is created');
  video.elt.addEventListener('loadeddata', function() {
    // set cursor back to default
    if (video.elt.readyState >= 2) {
      document.body.style.cursor = 'default';
      console.log('video element is ready! Click "Start Detecting" to see the magic!');
    }
  });
}


function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoEl.innerText = 'Launch Video';
  } else {
    video.show();
    toggleVideoEl.innerText = 'Close Video';
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingEl.innerText = 'Stop Detecting';
  } else {
    toggleDetectingEl.innerText = 'Start Detecting';
  }
  detecting = !detecting;
}

function detect() {
  // instruct "detector" object to start detect object from video element
  // and "onDetected" function is called when object is detected
  detector.detect(video, onDetected);
}

// callback function. it is called when object is detected
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  // keep detecting object
  if (detecting) {
    detect();
  }
}

function draw() {
  // canvas background
  background('blue');
  // draw 1st rectangle
  stroke('green');
  fill('red');
  rect(100, 100, 70, 80);
  // draw 2nd rectangle
  stroke('black');
  noFill();
  rect(200, 200, 30, 50);
}


// set cursor to wait until video element is loaded
document.body.style.cursor = 'wait';

// the draw() function continuously executes until the noLoop() function is called
function draw() {
  if (!video || !detecting) return;
  // draw video frame to canvas and place it at the top-left corner
  image(video, 0, 0);
  // draw all detected objects to the canvas
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
    console.log(detections[i]);
  }
}

function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}

// draw bounding box around the detected object
function drawBoundingBox(object) {
  // Sets the color used to draw lines.
  stroke('green');
  // width of the stroke
  strokeWeight(4);
  // Disables filling geometry
  noFill();
  // draw an rectangle
  // x and y are the coordinates of upper-left corner, followed by width and height
  rect(object.x, object.y, object.width, object.height);
}

// draw label of the detected object (inside the box)
function drawLabel(object) {
  // Disables drawing the stroke
  noStroke();
  fill('white');
  textSize(24);
  // draw label and confidence level
  text(`${object.label} ${object.confidence.toFixed(3)}`, object.x + 10, object.y + 24);
}
