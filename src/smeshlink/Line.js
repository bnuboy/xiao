function Line(color){
	this.startPoint;
	this.endPoint;
	this.lineColor = color;
	this.i = 1;
	this.tLine = new createjs.Shape();
	containerLine.addChildAt(this.tLine,0);
}
Line.prototype.setStartPoint = function(p){
	this.startPoint = p;
}
Line.prototype.setEndPoint = function(p){
	this.endPoint = p;
}
Line.prototype.drawLine = function(){
	
	this.tLine.graphics.clear().setStrokeStyle(1,"round").beginStroke(this.lineColor).moveTo(this.startPoint.x, this.startPoint.y).lineTo(this.endPoint.x,this.endPoint.y);
	//stage.addChildAt(tLine,2);
	stage.update();
}