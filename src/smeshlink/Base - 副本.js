function Base(nodeId,x,y,nodeImg){
	this.nodeId = nodeId;
	this.x      = x;
	this.y      = y;
	this.txt    = new createjs.Text(nodeId,"24px Arial","#ff0000");
	this.bitmap = new createjs.Bitmap(nodeImg);
	this.bitmap.x = this.x;
	this.bitmap.y = this.y;
	this.lines = [];
	if(nodeId < 10){
		this.txt.x = this.bitmap.x - 12;
		this.txt.y = this.bitmap.y + 5;
	}else if(nodeId < 100){
		this.txt.x = this.bitmap.x - 20;
		this.txt.y = this.bitmap.y + 5;
	}else{
		this.txt.x = this.bitmap.x - 25;
		this.txt.y = this.bitmap.y + 5;
	}
	this.bitmap.nodeId = nodeId;
	this.bitmap.regX = 25;
	this.bitmap.regY = 25;
	var $this = this;
	this.bitmap.onPress = function(evt){handBitmapOnPress(evt,$this);};
	//stage.addChildAt(this.bitmap,1);
	//stage.addChildAt(this.txt,2);
	containerNode.addChildAt(this.bitmap,0);
	containerNode.addChildAt(this.txt,1);
	stage.update();
}
Base.prototype.setRssi = function(rssi){
	this.rssi = rssi;
}
Base.prototype.handBitmapOnPress= function (evt){
	var target = evt.target;
	evt.onMouseMove = function(e){
		console.log(e);
		target.x = e.stageX;
		target.y = e.stageY;
		stage.update();
	}
}
Base.prototype.addLine = function(line,p){
	this.lines.push({"line":line,"point":p});
}
function handBitmapOnPress(evt,$this){
	var target = evt.target;
	var oldNodeX  = target.x;
	var oldMouseX = evt.stageX;
	var oldNodeY  = target.y;
	var oldMouseY = evt.stageY;
	var moveFlag = false;
	evt.onMouseMove = function(e){
		moveFlag = true;
		target.x = oldNodeX + e.stageX - oldMouseX;
		target.y = oldNodeY + e.stageY - oldMouseY;
		console.log($this.txt.x);
		if($this.nodeId < 10){
			$this.txt.x = target.x - 12;
			$this.txt.y = target.y + 5;
		}else if($this.nodeId < 100){
			$this.txt.x = target.x - 20;
			$this.txt.y = target.y + 5;
		}else{
			$this.txt.x = target.x - 25;
			$this.txt.y = target.y + 5;
		}
		//lineMap.get($this.nodeId).graphics.clear().setStrokeStyle(1,"round").beginStroke("#000").moveTo($this.txt.x,$this.txt.y).lineTo(lineInfo.get($this.nodeId)[2],lineInfo.get($this.nodeId)[3]);
		for(var i = 0; i < $this.lines.length;i ++){
			//$this.lines[i].line.setStartPoint(new Point(target.x,target.y));
			//$this.lines[i].line.setEndPoint($this.lines[i].line.startPoint);
			//$this.lines[i].line.drawLine();
			$this.lines[i].line.graphics.clear().setStrokeStyle(1,"round").beginStroke("#000").moveTo($this.txt.x,$this.txt.y).lineTo($this.lines[i].point.x,$this.lines[i].point.y);
		}
		stage.update();
		
		document.getElementById("nodeInfo").innerHTML = "节点坐标：（" + target.x + "," + target.y + ") 节点id：" + target.nodeId;
	}
	evt.onMouseUp = function(e){
		if(!moveFlag){
			document.getElementById("nodeInfo").innerHTML = "节点坐标：（" + target.x + "," + target.y + ") 节点id：" + target.nodeId;
		}else{
			msg.setMethod("TopData.createTopology");
			msg.params = Array("" + target.nodeId +"," + target.x + "," + target.y);
			try{
				client.send(msg.xml(), true, handleCreateTopology);
			}catch(x){
				alert(x);
			}
			moveFlag = false;
		}
	}
}
function handleCreateTopology(req){
	
}