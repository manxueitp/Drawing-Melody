var socket;

var playing = false;
var painting= false;
//set brush
var bSize=Math.round(8+15*Math.random());//8-23


var r = [230,249,230,241,16,11,10,47];
var g = [11,11,229,124,241,279,130,132];
var b = [168,98,11,16,119,291,204,132];
var alpha=0.8;

var clientPaintStatus = false;
var clientMover;
var lastClientMover;
var cMovers=[];
var clientMovers=[];

var indicator = null;
var indicators=[];

var randomId;

var currentKey=0;
var lastKey = 0;

var width;
var height;
var currentUsers=[];

var interspace;
var halfNoteSpace;


function setup() {
  width = document.getElementById('canvas').offsetWidth;
  height = document.getElementById('canvas').offsetHeight - 5;
  if (width> windowWidth){
    width=windowWidth;
  }
  if (height> windowHeight){
    height=windowHeight;
  }
  var myCanvas = createCanvas(width,height);
  myCanvas.parent('canvas');

  frameRate(60);
  background(255);
  
  socketReceiver(); 
}//set up end


function socketReceiver(){
  id = floor(random(100000));
  socket = io();

  socket.on('initialUser',
    function(data){
      console.log("initialUser");
    }
  );

  socket.on('updateUserList',
    function(data){
      currentUsers= data;
      console.log(currentUsers);
    }

  );

   socket.on('newmover',
    function(data){
      clientMover=new Mover(data.id,data.mass,data.note);
      clientPaintStatus = false;
      clientMovers.push(clientMover);
    }
  );
  
  socket.on('addposition',
    function(data){
      for (var i = 0; i < clientMovers.length; i++) {
          if (clientMovers[i].id === data.id) {
            clientMovers[i].addPosition(data.x, data.y);
            currentKey=floor(data.x/interspace);
          }
        } 
      clientPaintStatus = true;
    }
  );
  
  socket.on('finishmover',
    function(data){
      for (var i = 0; i < clientMovers.length; i++) {
          if (clientMovers[i].id === data.id) {
            cMovers.push(clientMovers[i]);
            //console.log(clientMovers[i].id );
          }
          clientPaintStatus = false;
        } 
    }
  );

  socket.on('disconnect', function (data) {
    console.log("a user disconnected " + data);
  
     for (var i = 0; i < indicators.length; i++) {
          if (indicators[i].id === data) {
             indicators.splice(i,1);
          }
      }
    });
}//socket end

//------mouse Event---------------------------------------------------
function mousePressed() {
  var m = bSize/16+random(1,3);
  var bNote = Math.round(8*Math.random());
  randomId=Math.floor(random(100000));
  sendNewMover(randomId,m,bNote,clientPaintStatus);
}

function mouseReleased() {
  sendFinish(randomId,clientPaintStatus);
}

function mouseDragged() {
  sendmouse(randomId, mouseX,mouseY,clientPaintStatus);
}

//------touch Event----------------------------------------------
function touchStarted() {
  var m = bSize/16+random(1,3);
  var bNote = Math.round(8*Math.random());
  randomId=Math.floor(random(100000));
  sendNewMover(randomId,m,bNote,clientPaintStatus);
}

function touchEnded() {
  sendFinish(randomId,clientPaintStatus);
}

function touchMoved() {
  sendmouse(randomId, touchX,touchY,clientPaintStatus);
}

function draw() {
  background(255);
  //draw piano key
  strokeWeight(2);
  interspace = width/scaleArray.length;
  halfNoteSpace=interspace/5;

  stroke(250);
  for(var i = 0; i < scaleArray.length; i++) {
    line(i*interspace, 0, i*interspace, height);
  }
  for(var i = 0; i < scaleArray.length; i++) {
    stroke(220);
    fill(255);
    rect(i*interspace, 0, interspace, 60);
    if(i==1||i==2||i==4||i==5||i==6||i==8||i==9||i==11||i==12||i==13||i==15||i==16||i==18||i==19||i==20){
      fill(220);
      noStroke();
      rect(i*interspace-halfNoteSpace, 0, halfNoteSpace*2, 26);
    }
  }
  //finish draw

  //fill current key with blue color;
  for (var i = 0; i < clientMovers.length; i++) {
    if (clientPaintStatus) {
      clientMovers[i].display();  
      fill('rgba(4,202,232, 0.3)');
      noStroke();
      if(lastKey!=currentKey){
        //console.log(currentKey+"currentKey");
        rect(currentKey*interspace,0,interspace,60);
      }
      lastKey = currentKey;
      
    }
  }
  //
  for (var i = 0; i < cMovers.length; i++) {
    var wind = createVector(0.01, 0);
    var gravity = createVector(0, 0.1);
    cMovers[i].applyForce(wind);
    cMovers[i].applyForce(gravity);
    cMovers[i].update();
    cMovers[i].checkEdges();
    cMovers[i].display();
    if(cMovers[i].isDead()){
      cMovers[i].kill();
      cMovers.splice(i, 1);
    };
  }
}


//---------------- Function for sending to the socket-----------------------------------
function sendNewMover(id, m, bNote,clientPaintStatus) {
  clientPaintStatus=true;
  var data = {
    mass:m,
    id: id,
    note:bNote,
    ifCP:clientPaintStatus
  };
  socket.emit('newmover',data);
}

function sendmouse(id, xpos, ypos, clientPaintStatus) {
  var data = {
    id: id,
    x: xpos,
    y: ypos,
    ifCP:clientPaintStatus
  };
  socket.emit('addposition',data);
}

function sendFinish(id, clientPaintStatus) {
  clientPaintStatus=false;
  var data = {
    id: id,
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

$(window).bind(
  'touchmove',
   function(e) {
    e.preventDefault();
  }
);

