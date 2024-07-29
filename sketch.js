let img;
let classifier;
// let detector;


// for 'MobileNet', classifier
function preload() {
  console.log("preload");
  img = loadImage("dog-cat.png");
  classifier = ml5.imageClassifier("MobileNet");
  // detector = ml5.objectDetector("cocossd");
}

function gotDetections(results, error) {
  if (results) {
    console.log(results);
    for (let i = 0; i < results.length; i++) {
      let object = results[i];
      stroke(0, 255, 0);
      noFill();
      rect(object.x, object.y, object.width, object.height);
    }
  }
  console.log(error);

}

function setup() {
  createCanvas(640, 480);
  // loadImage("dog-cat.png");
  console.log(classifier);
  image(img, 0, 0);
  classifier.classify(img, gotDetections);
  // detector.detect(img, gotDetections);
}
