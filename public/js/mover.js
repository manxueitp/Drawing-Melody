var num;
var moversNum;
var colorInt;
var k=0;
var osc, envelope, fft;
var scaleArray = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];

var Mover = function(id, m, n) {
  this.mass = m;
  this.note=n;
  this.id= id;
  
  this.lifespan = 2000.0;
  this.alpha=this.lifespan/3;
  this.r=r[this.note];
  this.g=g[this.note];
  this.b=b[this.note];
  this.bcolor= "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  
  this.positions = [];
  this.uppositions = [];
  
  this.osc = new p5.Oscillator();
  console.log("add osc!!!")  
  this.scaleNum=floor(map(mouseX,0,width,0,22));
  this.changeMidiValue=scaleArray[this.scaleNum];
  this.changeFreqValue = midiToFreq(this.changeMidiValue);
  this.osc.freq(this.changeFreqValue);

  // time, ampLevel
  this.env = new p5.Env(0.01, 1.0, 0.3, 0.8, 0.5, 0.3, 3, 0.0);
  this.osc.amp(this.env);
  this.osc.start();

  this.gain = new p5.Gain();
  this.osc.disconnect();
  this.osc.connect(this.gain);
  this.gain.connect();
  this.env.triggerAttack();

  //this.changeFreqValue=0;
  this.count=0;

  this.addPosition = function(x, y) {
	  this.position = createVector(x, y);
	  num = this.positions.length;
    this.changeMelody(x);
    this.osc.freq(this.changeFreqValue);
    
    moversNum=30;
    if(num<moversNum){
      this.positions.push(this.position); 
    }  
  };
  
  this.run = function() {
    this.update();
    this.display();
  };

  this.applyForce = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  };
    
  this.update = function() {
  	for(var i=0; i<this.positions.length;i++){
      this.velocity.add(this.acceleration);
      this.positions[i].add(this.velocity);
      this.acceleration.mult(0);
    }
    this.lifespan -= 6;
    this.alpha=this.lifespan/2;
    this.bcolor= "rgba(" + r[this.note] + "," + g[this.note] + "," + b[this.note] + "," + this.alpha + ")";
  };

  this.display = function() {
    for(var i=0; i<this.positions.length;i++){
    strokeWeight(m*8+i/4);
    var mr=this.r-1*i;
    var mg=this.g-1*i;
    var mb=this.b-1*i;
    var malpha = this.alpha-i*30; 
    stroke(mr,mg,mb,malpha);
    line(upx, upy, this.positions[i].x, this.positions[i].y);
    var upx=this.positions[i].x;
    var upy=this.positions[i].y;
    };
  };

  this.checkEdges = function() {
    // var newAmp = constrain( this.amptemp*this.lifespan/255, 0, 1) ;
    var newAmp = map(this.lifespan, 2000, 0, 1, 0);

  	for(var i=0; i<this.positions.length;i++){
      if (this.positions[i].x > width) {
        this.positions[i].x = width;
        this.velocity.x *= -1;
        this.gain.amp(newAmp);
        this.env.play(this.osc);      
      } 
      else if (this.positions[i].x < 0) {
        this.velocity.x *= -1;
        this.positions[i].x = 0;
        this.gain.amp(newAmp);
        this.env.play(this.osc);
      }
      else if (this.positions[i].y > height) {
        this.velocity.y *= -1;
        this.positions[i].y = height;
        this.gain.amp(newAmp);
        this.env.play(this.osc);    
      }
    }
  };
  
  this.isDead = function() {
    
    if (this.lifespan <=0.0) {
      this.positions=[];
      //this.osc.amp(0, 0.6);
      this.lifespan=0;
      return true;
    } else {
      return false;
    }
  };//dead end

  this.strokeSize=function(a,b){
    var diff= b-a;
    var thick = frameCount % diff;
     if(thick == 0){
       k = abs(k - 1);
     }
     if( k == 0){
       strokeWeight(a + thick);
     }
     else{
       strokeWeight(b - thick);
     }
  }

  this.playing=function(){
    this.gain.amp(this.env);
    this.env.play(this.osc);
  }

  this.stopPlaying=function(){
    console.log('stop playing!');
    this.env.triggerRelease(this.osc);
    this.gain.amp(0, 0);
    this.osc.stop();
  }

  this.kill = function() {
    this.osc.stop();
    this.env.dispose();
    this.osc.dispose();
    console.log("osc killed")
  }

  this.changeMelody=function(x){
    scaleArray = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
    this.scaleNum=floor(map(x,0,width,0,22));
    this.changeMidiValue=scaleArray[this.scaleNum];
    this.changeFreqValue = midiToFreq(this.changeMidiValue);
  }
};