var Repeller = function(mass,width,height,x,y) {
   this.power = 30;
   this.position = createVector(x, y);

   this.mass = mass;
   this.width=width;
   this.height=height;

   this.display = function() {
   	stroke(150);
   	fill(150);
   	rect(this.position.x,this.position.y,this.width,this.height);
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
}
