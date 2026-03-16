let MAXWIDTH = 1200;
let MAXHEIGHT = 800;

let center = {x: MAXWIDTH/2,y: MAXHEIGHT/2}
let bpm = 120;


const accelData = {
    x:5,
    y:8,
    z:10
}

const rotationData = {
    x:5,
    y:5,
    z:5
}

const socket = io();
socket.on("sensor_data", data => {
	console.log(data);
	console.log("got Message");
	});

let accelColours;
let rotationColours;

let accelValues;
let rotationValues;

let previousAccelData = []; 
let previousRotationData = [];
let shiftedIteration = 0;



const AngleOffSet = 15 * Math.PI / 180;
const RotationFixedOffSet = AngleOffSet/2;
const ValueStretch = 5;
const InnerRingRadius = 120;
const DataStrokeWidth = 12;


function setup() {
  accelValues = Object.values(accelData); 
  rotationValues = Object.values(rotationData); 
  createCanvas(MAXWIDTH, MAXHEIGHT);
  setupColours(255);
}

function setupColours(alpha){
  accelColours = [color(170,205,129,alpha),color(237,145,126,alpha),color(208,157,210,alpha)]
  rotationColours = [color(91,174,202,alpha),color(154,195,175,alpha),color(118,120,209,alpha)]
}

let plot = true;
function draw() {
  background(220);
  background("black");

  Draw_Accel_Data();
  Draw_Rotation_Data();

  fill("black");
  stroke(0);
  circle(center.x, center.y, InnerRingRadius);

  BPM_Ring();

  drawKeys();
}

const DisplayAccelData = setInterval(()=>{
  updateAllValues()
  if (previousAccelData.length > 30){
    previousAccelData.shift();
    previousRotationData.shift();
    shiftedIteration++
  }

},200)

function BPM_Ring(){
  // temp code for data ===========
  bpm += Math.round(random(-1,1)); 
  // ==============================
  fill(color(0,0,0,0));
  stroke("white");
  strokeWeight(3);
  circle(center.x, center.y, bpm*3.4);
}

function updateAllValues(){
  accelData.x += random(-4,4); 
  accelData.y += random(-4,4); 
  accelData.z += random(-4,4); 
  rotationData.x += random(-2,2); 
  rotationData.y += random(-3,3); 
  rotationData.z += random(-5,5); 
  accelValues = Object.values(accelData); 
  rotationValues = Object.values(rotationData); 
  previousAccelData.push(accelValues);
  previousRotationData.push(rotationValues);
}

function sumArray(t_array){
  let value = 0;
  for (let i = 0 ; i < t_array.length; i++){
    value += t_array[i];
  }
  return value
}

function Draw_Accel_Data(){
   let NewAngle = 0;
  for (let j = 0; j < previousAccelData.length;j++)
  {
    NewAngle = (AngleOffSet * (j + shiftedIteration)) % 360;

    let values = previousAccelData.at(j);
  

    let runningRadius = InnerRingRadius + (sumArray(values)*ValueStretch);

    for (let currentValue =values.length-1 ;currentValue >= 0;currentValue--){
      dimColoursBasedOnIteration(j,previousAccelData.length)

      stroke(accelColours.at(currentValue));

      strokeWeight(DataStrokeWidth);
      let pointX = center.x + runningRadius * cos(NewAngle);
      let pointY = center.y - runningRadius * sin(NewAngle);
      line(center.x, center.y, pointX, pointY);
      runningRadius -= values.at(currentValue) * ValueStretch
    }
  }
  setupColours(255);
}

function dimColoursBasedOnIteration(iteration, endNum){
  let alpha = 255;
  let value =  endNum - iteration;
  alpha = 255 - value* 10;
  
  setupColours(alpha);
}

function Draw_Rotation_Data(){
   let NewAngle = 0;
  for (let j = 0; j < previousRotationData.length;j++)
  {
    NewAngle = ((AngleOffSet * (j + shiftedIteration)) + RotationFixedOffSet) % 360;

    let values = previousRotationData.at(j);

    let runningRadius = InnerRingRadius + (sumArray(values)*ValueStretch);

    for (let currentValue =values.length-1 ;currentValue >= 0;currentValue--){
      dimColoursBasedOnIteration(j,previousRotationData.length)
      stroke(rotationColours.at(currentValue));
      strokeWeight(DataStrokeWidth);

      let pointX = center.x + runningRadius * cos(NewAngle);
      let pointY = center.y - runningRadius * sin(NewAngle);
      line(center.x, center.y, pointX, pointY);
      runningRadius -= values.at(currentValue) * ValueStretch
    }
  }
  setupColours(255);
}

function drawKeys(){
  textAlign(LEFT);
  textSize(18);
  
  stroke(0);
  strokeWeight(2);

  // Acceleration Keys ===========================
  fill(accelColours[0]);
  text("(■) Acceleration X " + bpm.toString(), 40,MAXHEIGHT-20);
  fill(accelColours[1]);
  text("(■) Acceleration Y "  + bpm.toString(), 40,MAXHEIGHT-40);
  fill(accelColours[2]);
  text("(■) Acceleration Z "  + bpm.toString(), 40,MAXHEIGHT-60);

  // Rotation Keys ===========================
  fill(rotationColours[0]);
  text("(■) Rotation X "  + bpm.toString(), 40,MAXHEIGHT-200);
  fill(rotationColours[1]);
  text("(■) Rotation Y " + bpm.toString(), 40,MAXHEIGHT-180);
  fill(rotationColours[2]);
  text("(■) Rotation Z " + bpm.toString(), 40,MAXHEIGHT-160);


  // Other Keys ====================
  textAlign(RIGHT);
  fill(rotationColours[2]);
  text("Temp: " + bpm.toString(), MAXWIDTH-40,MAXHEIGHT-160);

  textSize(24);
  fill("white");
  textAlign(CENTER);
  text("BPM: " + bpm.toString(),center.x,center.y);

}
