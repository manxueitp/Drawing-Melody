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
var cMovers=[];
var clientMovers=[];

var indicator = null;
var indicators=[];

var randomId;

var repeller;

// var clientMovers = {
var width;
var currentUsers=[];

// };
function setup() {
  width = document.getElementById('canvas').offsetWidth;
  console.log(windowWidth);
  if (width> windowWidth){
    width=windowWidth;
  }
  console.log(width);
  var myCanvas = createCanvas(width,800);
  myCanvas.parent('canvas');

  frameRate(60);
  background(255);
  //repeller = new Repeller(20,100,100,200,400);
  
  socketReceiver(); 
}//set up end


function socketReceiver(){
   id = floor(random(100000));
   socket = io();
    //socket

  // socket.on('initialClient',
  //   function(data){
  //     console.log("initialClient");
  //     indicator=new Indicator(data.id,data.x,data.y);
  //     //fill(123,132,255);
  //     //ellipse(data.x,data.y,50,50);
  //     indicators.push(indicator);
  //   }
  // );

  socket.on('initialUser',
    function(data){
      console.log("initialUser");
      indicator=new Indicator(data.name,data.id,data.x,data.y);
      //fill(123,132,255);
      //ellipse(data.x,data.y,50,50);
      indicators.push(indicator);
    }
  );

  socket.on('updateUserList',
    function(data){
      //clientMovers[id] = 
      currentUsers= data;
      console.log(currentUsers);
    }

  );

   socket.on('newmover',
    function(data){
      //clientMovers[id] = 
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
            console.log(clientMovers[i].id );
          }
          
          clientPaintStatus = false;
        } 
    }
  );

  // socket.on('newmover',
  //   function(data){
  //     //clientMovers[id] = 
  //     clientMover=new Mover(data.id,data.mass,data.note);
  //     clientPaintStatus = false;
  //   }
  // );
  
  // socket.on('addposition',
  //   function(data){
  //     clientMover.addPosition(data.x, data.y); 
  //     clientPaintStatus = true;
  //   }
  // );
  
  // socket.on('finishmover',
  //   function(data){
  //     cMovers.push(clientMover);
  //     if (data.ifCP){
  //       clientMover.display();
  //     }
  //     clientPaintStatus = false;
  //     //clientMover.stopPlaying(); 
  //   }
  // );
  
  socket.on('updateMovement',
    function(data){
      
      if (indicators.length > 0) {
        for (var i = 0; i < indicators.length; i++) {
          if (indicators[i].id === data.id) {
            indicators[i].update(data.x, data.y);
          }
        }
      }
      else {
        console.log("no indicator");
        indicator=new Indicator(data.name,data.id,data.x,data.y);
        indicators.push(indicator);
      }
    });

  socket.on('disconnect', function (data) {
    console.log("a user disconnected " + data);
  
     for (var i = 0; i < indicators.length; i++) {
          if (indicators[i].id === data) {
             indicators.splice(i,1);
          }
      }
    });
}//socket end

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
  
  if (indicators!= []) {
    for (var i = 0; i < indicators.length; i++) {
      indicators[i].checkEdges();
      indicators[i].display();
  }
 }
  //console.log(clientPaintStatus);
  if (clientPaintStatus) {
    clientMover.display();    
  }

  for (var i = 0; i < cMovers.length; i++) {
  var wind = createVector(0.01, 0);
  var gravity = createVector(0, 0.1);
  cMovers[i].applyForce(wind);
  cMovers[i].applyForce(gravity);
  cMovers[i].update();
  cMovers[i].checkEdges();
  if(indicators.length>0){
   cMovers[i].applyRepeller(indicator);}

  cMovers[i].display();
    if ( cMovers[i].isDead() ) {
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
//---------------- touch----------------------------------//
canvas.addEventListener('touchmove', function(event) {
  console.log("touchmove");
}, false);