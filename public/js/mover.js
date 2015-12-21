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
  //tconsole.log(this.bcolor);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
  
  this.positions = [];
  this.uppositions = [];
  this.midiValue = scaleArray[this.note];
  this.freqValue = midiToFreq(this.midiValue);
  
  this.osc = new p5.Oscillator();
  //this.freqtemp=floor(map(mouseX,0,width,0, 500));
  
  this.scaleNum=floor(map(mouseX,0,width,0,22));
  this.changeMidiValue=scaleArray[this.scaleNum];
  this.changeFreqValue = midiToFreq(this.changeMidiValue);
  //this.osc.freq(this.freqValue+this.freqtemp);
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

  //this.freqtemp=0;
  this.changeFreqValue=0;
  //this.changeFreqValue=0;
  //this.changeMidiValue=0;
  //this.amptemp= this.mass;

  this.count=0;

  this.addPosition = function(x, y) {
	  this.position = createVector(x, y);
	  num = this.positions.length;
    //this.freqtemp=floor(map(x,0,width,0, 500));
    //this.freqtemp=floor(map(x,0,width,0, 500));
    //this.osc.freq(this.freqValue+this.freqtemp);
    this.changeMelody();
    this.osc.freq(this.changeFreqValue);
    //console.log(this.scaleNum);
    //console.log(this.changeMidiValue);
    

    moversNum=190;
    if(num<moversNum){
      this.positions.push(this.position);
      
    }else{
      // this.osc.amp(0, 0.1);
      // this.osc.stop(0.01);
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
    this.lifespan -= 2;
    this.alpha=this.lifespan/2;
    this.bcolor= "rgba(" + r[this.note] + "," + g[this.note] + "," + b[this.note] + "," + this.alpha + ")";
  };

  this.display = function() {
    //fill(this.bcolor);
    //console.log(this.positions)
    //this.strokeSize(9,14);
    for(var i=0; i<this.positions.length;i++){
    //ellipse(this.positions[i].x, this.positions[i].y, m*8-i/3, m*8-i/3);
    //this.uppositions.push(this.positions[i]);
    //this.alpha=100-i;
    strokeWeight(m*8+i/4);
    var mr=this.r-1*i;
    var mg=this.g-1*i;
    var mb=this.b-1*i;
    stroke(mr,mg,mb,this.alpha);
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
       else {
      	//this.osc.amp(0, 0.1);
        //this.osc.stop();
      }
    }
  };
  
  this.isDead = function() {
    
    if (this.lifespan <=0.0) {
        this.positions=[];
        this.osc.amp(0, 0.6);
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
    // this.osc.amp(0, 0.1);
    this.osc.stop();
  }


  this.kill = function() {
    this.osc.dispose();
    this.env.dispose();
  }

  this.applyRepeller=function(r){
    var force = r.repel(this);
    this.applyForce(force);
  }

  this.changeMelody=function(){
    //var scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];
    scaleArray = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84];
    this.scaleNum=floor(map(mouseX,0,width,0,22));
    this.changeMidiValue=scaleArray[this.scaleNum];
    this.changeFreqValue = midiToFreq(this.changeMidiValue);
    //this.changeMidiValue=floor(map(mouseX,0,width,48,83));
    //this.changeFreqValue = midiToFreq(this.changeMidiValue);

  }


};