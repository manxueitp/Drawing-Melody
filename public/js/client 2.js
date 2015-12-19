//---------------------------touch------------------------------
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


//--------------------------------------------------acceloration---------------------
// var distance_X = 0;
// var velocity_X = 0;
// var distance_Y = 0;
// var velocity_Y = 0;

// function ondevicemotion(e) {
//     var x = e.acceleration.x;
//     var y = e.acceleration.y;
//     var z = e.acceleration.z;

//     var elem = document.getElementById('map');
//     map.innerHTML = x + " " + y + " " + z;

// }



// function update_acceleration(acceleration_X，acceleration_Y) {
//     velocity_X = velocity_X + acceleration_X;
//     distance_X = distance_X + velocity_X;
//      velocity_Y = velocity_Y + acceleration_Y;
//     distance_Y = distance_Y + velocity_Y;
// }

// // To use the distance value just read the distance_X variable:
// function get_distance_X_and_reset () {
//     x = distance_X;
//     distance_X = 0;
//     return x;
// }

//window.addEventListener('devicemotion', ondevicemotion, false);
//-------------------------------------------------------------------------------------------

var count = 0;

function getOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', onOrientationChange, false);
  } else {
    document.getElementById("doEvent").innerHTML = "Not supported on your device or browser.  Sorry."
  }
}

function onOrientationChange(eventData) {
      var tiltLR = eventData.gamma;
      var tiltFB = eventData.beta;
      var dir = eventData.alpha

      deviceOrientationHandler(tiltLR, tiltFB, dir);
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


// Some other fun rotations to try...
//var rotation = "rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
//var rotation = "rotate("+ tiltLR +"deg) rotate3d(0,1,0, "+ (tiltLR*-1)+"deg) rotate3d(1,0,0, "+ (tiltFB*-1)+"deg)";
//---------------------hammer-----------------------------------------------------

// function hammer(){
// 	var myElement = document.getElementById('myElement');

//     var mc = new Hammer(myElement);

// // listen to events...
// 	mc.on("panleft panright tap press", function(ev) {
// 	    myElement.textContent = ev.type +" gesture detected.";
// 	});
// }

// var hammertime = Hammer(myElement, {
//      prevent_default: true,
//      no_mouseevents: true
// });
// hammertime.on('touch', function(ev) {
//     console.log("touch");
//     $("#info").html("touch");
// });
// hammertime.on('touch', function(ev) {
//     console.log("drag");
//     $("#info").html("drag");
// });
// hammertime.on('release', function(ev) {
//     console.log("release");
//     $("#info").html("release");
// });
// -----------------touch-------------------------------------------------------------------------
var handleTouchEvent = function(e) {
 
	// Get the list of all touches currently on the screen
    startPeristentVibrate(1000, 100);
	var allTouches = e.touches,
	    allTouchesLength = allTouches.length,
 
	// Get a reference to an element on the page to write the total number of touches 
	// currently on the screen into
 
	 touchCountElem = document.getElementById("touch-count"); 
 
	// Prevent the default browser action from occurring when the user touches and
	// holds their finger to the screen
    console.log(e.type);
	if (e.type === 'touchstart') {
		e.preventDefault();
		touchCountElem.innerHTML = 'There are currently ' + allTouchesLength + ' touches on the screen.';
		getOrientation();
	} else if(e.type === 'touchend'){
		touchCountElem.innerHTML = 'no touch';
	}
 
	// Write the number of current touches onto the page
 
	
}
 
// Assign the event handler to execute when a finger touches ('touchstart') or is removed from ('touchend') the screen
 
window.addEventListener('touchstart', handleTouchEvent, false);
window.addEventListener('touchend', handleTouchEvent, false);

