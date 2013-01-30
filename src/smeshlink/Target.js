function Target(img,tag_id,locationPeriod){
	this.img = img;
	this.tag_id = tag_id;
	this.locationPeriod = locationPeriod;
	this.arr = new Array();
	this.calculate = new Calculate();
	this.bitmap = new createjs.Bitmap(this.img);
	this.bitmap.regX = 15;
	this.bitmap.regY = 15;
	this.ox = 0;
	this.oy = 0;
	this.bitmap.onClick = handTargetOnClick;
}
Target.prototype.setTagId = function(tag_id){
	this.tag_id = tag_id;
}
Target.prototype.addRssi = function(nodeParam,rssiParam){
	this.arr.push([nodeParam,rssiParam]);
}
Target.prototype.setTime = function(time){
	this.bitmap.name = time;
}
Target.prototype.calSimpleZhixin = function(){
	for(var i =0; i < this.arr.length; i ++){
		this.ox += this.arr[i][0].bitmap.x;
		this.oy += this.arr[i][0].bitmap.y;
	}
	this.ox = parseInt(this.ox/(this.arr.length));
	this.oy = parseInt(this.oy/(this.arr.length)); 
	return [this.ox,this.oy];
}
Target.prototype.drawTraceTarget = function(){
	if(isNaN(this.ox) || isNaN(this.oy == NaN)){
		return;
	}
	this.bitmap.x = this.ox + 30;
	this.bitmap.y = this.oy;
	if(this.tag_id < 10){
		this.txt = new createjs.Text(this.tag_id,"20px Arial","#000000");
		this.txt.x = this.bitmap.x - 5;
		this.txt.y = this.bitmap.y + 7;
	}else if(this.tag_id < 100){
		this.txt = new createjs.Text(this.tag_id,"18px Arial","#000000");
		this.txt.x = this.bitmap.x - 7;
		this.txt.y = this.bitmap.y + 5;
	}else{
		this.txt = new createjs.Text(this.tag_id,"16x Arial","#000000");
		this.txt.x = this.bitmap.x - 8;
		this.txt.y = this.bitmap.y + 5;
	}
	var $this = this;
	$this.bitmap.visible = false;
	$this.txt.visible = false;
	containerTarget.addChild($this.bitmap);
	containerTarget.addChild($this.txt);
}
Target.prototype.calZhixin = function(){
	var tempr = this.arr[0][1];
	var tempi = 0;
	for(var i = 1; i < this.arr.length; i ++){
		if(tempr < this.arr[i][1]){
			tempr = this.arr[i][1];
			tempi = i;
		}
	}
	this.ox = (this.arr[0][0].bitmap.x + this.arr[1][0].bitmap.x + this.arr[2][0].bitmap.x) / 3;
	this.oy = (this.arr[0][0].bitmap.y + this.arr[1][0].bitmap.y + this.arr[2][0].bitmap.y) / 3;
	this.ox = parseInt(this.ox + (this.arr[tempi][0].x - this.ox)*2 / 5);
	this.oy = parseInt(this.oy + (this.arr[tempi][0].y - this.oy)*2 / 5);
	return [this.ox,this.oy];
}
Target.prototype.drawTarget = function(){
	
	if(isNaN(this.ox) || isNaN(this.oy == NaN)){
		return;
	}
	this.bitmap.x = this.ox + 30;
	this.bitmap.y = this.oy;
	//stage.addChildAt(this.bitmap,3);
	containerTarget.addChild(this.bitmap);
	if(this.tag_id < 10){
		this.txt = new createjs.Text(this.tag_id,"20px Arial","#000000");
		this.txt.x = this.bitmap.x - 5;
		this.txt.y = this.bitmap.y + 7;
	}else if(this.tag_id < 100){
		this.txt = new createjs.Text(this.tag_id,"18px Arial","#000000");
		this.txt.x = this.bitmap.x - 7;
		this.txt.y = this.bitmap.y + 5;
	}else{
		this.txt = new createjs.Text(this.tag_id,"16x Arial","#000000");
		this.txt.x = this.bitmap.x - 8;
		this.txt.y = this.bitmap.y + 5;
	}
	var $this = this;
//	setTimeout(
//			function(){
//				$this.bitmap.visible = false;
//				$this.txt.visible = false;
//	},this.locationPeriod);
	containerTarget.addChild(this.txt);
	stage.update();
}
function handTargetOnClick(evt){
	var target = evt.target;
	document.getElementById("nodeInfo").innerHTML = "节点坐标：（" + target.x + "," + target.y + ")时间：" + target.name;
}
Target.prototype.calPos = function(m,n,o){
	for(var i = 0; i < this.arr.length; i++){
		var r = this.arr[i][1];
		var x = this.arr[i][0].x;
		var y = this.arr[i][0].y;
		var circle = new Circle(x,y,r);
		this.calculate.addCircle(circle);
	}
	return this.calculate.addPoints(m,n,o);
}