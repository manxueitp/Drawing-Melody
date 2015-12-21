
//var socket;
//socket = io.connect('http://localhost:3000');
var socket = io();
var id;
id = Math.floor((Math.random() * 10000) + 1);
console.log(id);
var clientPaintStatus=false;
var bSize=Math.round(8+15*Math.random());//8-23
//---------------------------init------------------------------



function init(){
	x=Math.floor((Math.random() * 900) + 50);
	y=Math.floor((Math.random() * 500) + 50);
	initclient(id,x,y);
}

//----------------------------send user name input-------
// Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $loginPage = $('.login.page'); // The login page
  var $drawingPage = $('.drawing.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var $currentInput = $usernameInput.focus();

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    socket.username=username;

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $drawingPage.show();
      $loginPage.off('click');
      detectTouch();
      init();
      getOrientation();
      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      
        setUsername();
      
    }
  });
// Click events
// Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Socket events
//---------------------------vibration------------------------------
var supportsVibrate = "vibrate" in navigator;
var vibrateInterval;

// Starts vibration at passed in level
function startVibrate(duration) {
	navigator.vibrate(duration);
}

// Stops vibration
function stopVibrate() {
	// Clear interval and stop persistent vibrating 
	if(vibrateInterval) clearInterval(vibrateInterval);
	navigator.vibrate(0);
}

// Start persistent vibration at given duration and interval
// Assumes a number value is given
function startPeristentVibrate(duration, interval) {
	vibrateInterval = setInterval(function() {
		startVibrate(duration);
	}, interval);
}

//-------------------------------------------------------------------------------------------

function getOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onOrientationChange, false);
  } else {
    document.getElementById("doEvent").innerHTML = "Not supported on your device or browser. Sorry."
  }
}

function onOrientationChange(eventData) {
      var tiltLR = Math.round(eventData.gamma);
      var tiltFB = Math.round(eventData.beta);
      var dir = eventData.alpha;
      
      deviceOrientationHandler(tiltLR, tiltFB, dir);
      sendacc(tiltLR, tiltFB, clientPaintStatus, id , name);


}

function deviceOrientationHandler(tiltLR, tiltFB, dir) {
  document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);//left and right
  document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);//up and down(front and back)
  document.getElementById("doDirection").innerHTML = Math.round(dir);
  // Apply the transform to the image
  var logo = document.getElementById("imgLogo");
  logo.style.webkitTransform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
  logo.style.MozTransform = "rotate("+ tiltLR +"deg)";
  logo.style.transform = "rotate("+ tiltLR +"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
}

// -----------------touch-------------------------------------------------------------------------
function detectTouch() {
   var handleTouchEvent = function(e) {
 
  // Get the list of all touches currently on the screen
  startPeristentVibrate(1000, 100);
  var allTouches = e.touches,
  allTouchesLength = allTouches.length,

 
   touchCountElem = document.getElementById("touch-count"); 
  if (e.type === 'touchstart') {
    e.preventDefault();
    touchCountElem.innerHTML = 'There are currently ' + allTouchesLength + ' touches on the screen.';
    // var m = bSize/16+random(1,3);
    // var bNote = Math.round(8*Math.random());
    // sendNewMover(id,m,bNote,clientPaintStatus);
    // sendmouse(id,currentX,currentY,clientPaintStatus);
    
  } else if(e.type === 'touchend'){
    touchCountElem.innerHTML = 'no touch';
    //sendFinish(id,clientPaintStatus);
  } 
}
window.addEventListener('touchstart', handleTouchEvent, false);
window.addEventListener('touchend', handleTouchEvent, false);
}
//------------------------------------socket send to server----------------------------------------------------------
function initclient(id,x,y){
  var data = {
  	id: socket.id,
    x: x,
    y: y
    
  };
  socket.emit('initialClient',data);
}

function sendacc(xacc, yacc, clientPaintStatus, id, name) {
  var data = {
    x: xacc,
    y: yacc,
    ifCP:clientPaintStatus,
    id: socket.id,
    name: socket.username
  };
  socket.emit('updateMovement',data);
}

// function sendNewMover(id, m, bNote,clientPaintStatus) {
//   clientPaintStatus=true;
//   var data = {
//     mass:m,
//     id: socket.id,
//     note:bNote,
//     ifCP:clientPaintStatus
//   };
//   socket.emit('newmover',data);
// }

// function sendmouse(id, xpos, ypos, clientPaintStatus) {
//   var data = {
//     id: socket.id,
//     x: xpos,
//     y: ypos,
//     ifCP:clientPaintStatus
//   };
//   socket.emit('addposition',data);
// }

// function sendFinish(id, clientPaintStatus) {
//   clientPaintStatus=false;
//   var data = {
//     id: socket.id,
//     ifCP:clientPaintStatus
//   };
//   socket.emit('finishmover',data);
//}