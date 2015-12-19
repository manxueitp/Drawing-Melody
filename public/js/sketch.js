var socket;

var playing = false;
var painting= false;
//set brush
var bSize=Math.round(8+15*Math.random());//8-23


var r = [230,249,230,241,16,11,10,47];
var g = [11,11,229,124,241,279,130,132];
var b = [168,98,11,16,119,291,204,132];
var alpha=0.8;

//var currentMover;
//var movers = [];
var clientPaintStatus = false;
var clientMover;
var cMovers=[];

var id;

var repeller;

// var clientMovers = {

// };
function setup() {
  console.log('in setup!!');
  var width = document.getElementById('canvas').offsetWidth;
  console.log(width);
  var widthH=width;
  var myCanvas = createCanvas(1190,600);
  myCanvas.parent('canvas');

  frameRate(60);
  background(0);
  repeller = new Repeller(20,100,100,200,400);
  
  socket();
   
  
  
}//set up end

function socket(){
   id = floor(random(100000));
   socket = io.connect('http://104.131.68.226:8001');
    //socket
   socket.on('newmover',
    function(data){
      //clientMovers[id] = 
      clientMover=new Mover(data.mass,data.note);
      clientPaintStatus = false;
    }
  );
  
  socket.on('addposition',
    function(data){
      clientMover.addPosition(data.x, data.y); 
      clientPaintStatus = true;
    }
  );
  
  socket.on('finishmover',
    function(data){
      cMovers.push(clientMover);
      if (data.ifCP){
        clientMover.display();
      }
      clientPaintStatus = false;
      //clientMover.stopPlaying(); 
    }
  );
//socket end
}

function mousePressed() {
  var m = bSize/16+random(1,3);
  var bNote = Math.round(8*Math.random());
  //currentMover = new Mover(m,bNote);
  //painting = true;
  sendNewMover(m,bNote,clientPaintStatus);
}

function mouseReleased() {
  //currentMover.stopPlaying();  
  //movers.push(currentMover);
  //painting = false;
  sendFinish(clientPaintStatus);
}

function mouseDragged() {
  //currentMover.addPosition(mouseX,mouseY);
  sendmouse(mouseX,mouseY,clientPaintStatus);
}

function draw() {
  background(255);

  //repeller.display();
  
  if (painting){
    //currentMover.display();
  }
  else{
    //osc.amp(0, 0.1);
    //currentMover.stopPlayNotes();

  }

  //console.log(clientPaintStatus);
  if (clientPaintStatus) {
    clientMover.display();    
  }


  // for (var i = 0; i < movers.length; i++) {
  //   var wind = createVector(0.01, 0);
  //   var gravity = createVector(0, 0.1);
  //   movers[i].applyForce(wind);
  //   movers[i].applyForce(gravity);
  //   movers[i].update();
  //   movers[i].checkEdges();
  //   movers[i].display();

  //   if ( movers[i].isDead() ) {
  //     movers[i].kill();
  //     movers.splice(i, 1);
  //   };
  // }


  for (var i = 0; i < cMovers.length; i++) {
  var wind = createVector(0.01, 0);
  var gravity = createVector(0, 0.1);
  cMovers[i].applyForce(wind);
  cMovers[i].applyForce(gravity);
  cMovers[i].update();
  cMovers[i].checkEdges();
  //cMovers[i].applyRepeller(repeller);

  cMovers[i].display();
    if ( cMovers[i].isDead() ) {
      cMovers[i].kill();
      cMovers.splice(i, 1);
    };
  }  
}


//---------------- Function for sending to the socket-----------------------------------
function sendNewMover(m,bNote,clientPaintStatus) {
  clientPaintStatus=true;
  var data = {
    mass:m,
    note:bNote,
    ifCP:clientPaintStatus
  };
  socket.emit('newmover',data);
}

function sendmouse(xpos, ypos, clientPaintStatus) {
  var data = {
    x: xpos,
    y: ypos,
    ifCP:clientPaintStatus
  };
  socket.emit('addposition',data);
}

function sendFinish(clientPaintStatus) {
  clientPaintStatus=false;
  var data = {
    ifCP:clientPaintStatus
  };
  socket.emit('finishmover',data);
}


function sendmovers(movers, bSize, bNote) {
  var data = {
    movers: movers,
    size:bSize,
    note:bNote
  };
  socket.emit('othermovers',data);
}