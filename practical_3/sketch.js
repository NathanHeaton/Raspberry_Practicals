let MAXWIDTH = 1200;
let MAXHEIGHT = 800;

let center = {x: MAXWIDTH/2,y: MAXHEIGHT/2}
let bpm = 120;

const accelData = {
    x:5,
    y:5,
    z:5
}

const rotationData = {
    x:5,
    y:5,
    z:5
}

let previousAccelData = []; 

let accelValues;
let rotationValues;

const accelColours = ["red","green","blue"]
const rotationColours = ["white","purple","orange"]

function setup() {
  accelValues = Object.values(accelData); 
    createCanvas(MAXWIDTH, MAXHEIGHT);
}

let plot = true;
function draw() {
  background(220);
  background("black");


  BPM_Ring();

  drawKeys();

  plot_Accel_Data();



}

const DisplayAccelData = setInterval(()=>{
  angle -= 15 * PI / 180;
  updateAllValues()
  console.log(previousAccelData);
},500)


function drawKeys(){
  textSize(24);
  stroke(0);
  strokeWeight(0);

  // Acceleration Keys ===========================
  fill(accelColours[0]);
  text("X Acceleration Rate:" + bpm.toString(), 40,MAXHEIGHT-20);
  fill(accelColours[1]);
  text("Y Acceleration Rate:" + bpm.toString(), 40,MAXHEIGHT-40);
  fill(accelColours[2]);
  text("Z Acceleration Rate:" + bpm.toString(), 40,MAXHEIGHT-60);

  // Rotation Keys ===========================
  fill(rotationColours[0]);
  text("X Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-200);
  fill(rotationColours[1]);
  text("Y Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-180);
  fill(rotationColours[2]);
  text("Z Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-160);

  // Other Keys ====================
    
  fill(rotationColours[0]);
  text("X Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-200);
  fill(rotationColours[1]);
  text("Y Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-180);
  fill(rotationColours[2]);
  text("Z Rotation Rate:" + bpm.toString(), 40,MAXHEIGHT-160);
}

function BPM_Ring(){
  // temp code for data ===========
  bpm += Math.round(random(-1,1)); 
  // ==============================

  fill("black");
  stroke("white");
  strokeWeight(3);
  circle(center.x, center.y, bpm*3.4);

  textSize(24);
  fill(255);
  stroke(0);
  strokeWeight(4);
  text("Heart Rate:" + bpm.toString(),MAXWIDTH-500,MAXHEIGHT-40)


}

let angle = 0;

function updateAllValues(){
  accelData.x += random(-4,4); 
  accelData.y += random(-4,4); 
  accelData.z += random(-4,4); 
  accelValues = Object.values(accelData); 
  previousAccelData.push(accelValues);
}

function plot_Accel_Data(){

  for (let i=0;i < accelValues.length;i++){
    fill(accelColours.at(i));
    stroke(accelColours.at(i));

    console.log(accelValues.at(i));
    strokeWeight(3);
    let radius = accelValues.at(i)*5;
    let pointX = center.x + radius * cos(angle);
    let pointY = center.y - radius * sin(angle);
    line(center.x, center.y, pointX, pointY);
  }
}