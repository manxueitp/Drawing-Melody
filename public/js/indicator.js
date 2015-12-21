var Indicator = function(name,id,x,y) {
  this.power = 5;
  this.id=id;
  this.name=name;
  
  this.bcolor= "rgba(" + 195 + "," + 195 + "," + 195 + ")";
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.acceleration = createVector(0, 0);
//trangle points
  this.x1=this.position.x-20;
  this.y1=this.position.y+10;
  this.x2=this.position.x;
  this.y2=this.position.y+52;
  this.x3=this.position.x+20;
  
  this.run = function() {
    this.update();
    this.display();
  };

  this.update = function(xacc,yacc) {
    //--acc------------------------------
    this.xac=Math.round(xacc/30);
    this.yac=-Math.round(yacc/30);
    this.acceleration = createVector(this.xac,this.yac);
    //this.velocity.add(this.acceleration);
    this.acceleration.limit(2);
    this.position.add(this.acceleration);
    this.acceleration.mult(0);
  };
  
  this.display = function() {
    fill(253,74,129);
    noStroke();
    this.x1=this.position.x-10;
    this.y1=this.position.y+5;
    this.x2=this.position.x;
    this.y2=this.position.y+20;
    this.x3=this.position.x+10;
    triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y1);

    textSize(24);
    text(this.name, this.x2, this.y2+30);

  };

  this.checkEdges = function() {
     if (this.x3 > width) {
        this.position.x = this.position.x;      
      } 
      else if (this.x1 < 0) {
        this.position.x = this.position.x; 
      }
      else if (this.y2 > height) {
        this.position.y = this.position.y;    
      }
      else if (this.y1 < 0) {
        this.position.y = this.position.y;    
      }
  };
  
  
  this.repel=function(Mover){
      var dir = p5.Vector.sub(this.position, Mover.position); // Calculate direction of force
      var d = dir.mag();                                // Distance between objects
      dir.normalize();                                  // Normalize vector (distance doesn't matter here, we just want this vector for direction)
      d = constrain(d, 1, 5);                         // Keep distance within a reasonable range
      var force = -1 * this.power/ (d * d);             // Repelling force is inversely proportional to distance
      dir.mult(force);                                  // Get force vector --> magnitude * direction
      return dir;
   };

  this.kill = function() {
    //this.osc.dispose();
    //this.env.dispose();
  }




};