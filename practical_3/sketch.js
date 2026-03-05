let MAXWIDTH = 1200;
let MAXHEIGHT = 800;

let bpm = 120;
let accelData = [{x:40},{y:40},{z:30}];
let accelColours = ["green","blue","red"]
let gyroData = [{x:0},{y:0},{z:0}];

function setup() {
    createCanvas(MAXWIDTH, MAXHEIGHT);
}

function draw() {

  background(220);
  background("black");

  stroke("white");
  strokeWeight(3);
  line(0, MAXHEIGHT - 20, MAXWIDTH, MAXHEIGHT -20);

  //BPM_Ring();
  plot_Accel_Data();

}


function BPM_Ring(){
  // temp code for data ===========
  bpm += Math.round(random(-1,1)); 
  // ==============================

  fill("black");
  stroke("white");
  strokeWeight(3);
  circle(MAXWIDTH/2, MAXHEIGHT/2, bpm*3.4);

  textSize(24);
  fill(255);
  stroke(0);
  strokeWeight(4);

  text("Heart Rate:" + bpm.toString(),MAXWIDTH-500,MAXHEIGHT-40)
}

function plot_Accel_Data(){
  // temp code for data ===========
  accelData.x += random(0,4); 
  accelData.y += random(0,4); 
  accelData.z += random(0,4); 
  // ==============================

  for (let i=0;i < accelData.length;i++){
    fill(accelColours.at(i));
    //stroke("white");
    console.log(accelData.at(i));
    //strokeWeight(3);
    rect(MAXWIDTH/2, MAXHEIGHT/2, 20, accelData.at(i)*5);
  }

    fill("red");
    rect(MAXWIDTH/2, MAXHEIGHT/2, 20, accelData.x);
}