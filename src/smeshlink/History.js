function History(){
	this._curId = 0;
	this._node = [];
	this._target = [];
	this.tag_id = 0;
	this.data1Length = 0;
	this.data = new Array();
	this.data1 = [];   //将data进行分组，每5秒一组数，数组的长度就是每个tagid的位置数目
	//this.line = new Line("#000000");
	//this.time;
}
History.prototype.startTrace = function(){
	var his = this;
	this.time = setInterval(function(){his.calPoint();},1000);
}
//将的到的数据按照时间先后顺序排序好
History.prototype.calData = function(data){
	var l = data.length;
	for(var i = 0;i < l - 1;i ++){
		var t1 = new Date(data[i].time.replace(/-/g,"/"));
		for(var j = i + 1;j < l;j ++){
			var t2 = new Date(data[j].time.replace(/-/g,"/"));
			if(t1.getTime() < t2.getTime()){
				var temp = data[j];
				data[j] = data[i];
				data[i] = temp;
			}
		}
	}
	var data1Counter = 0;
	var start = new Date(data[l - 1].time.replace(/-/g,"/"));
	for(var i = l - 1; i >= 0; i --){
		var tempTime = new Date(data[i].time.replace(/-/g,"/"));
		if((tempTime.getTime() - start.getTime())/1000 < 5){
			
		}else{
			data1Counter++;
			start = new Date(data[i].time.replace(/-/g,"/"));
		}
		if(this.data1[data1Counter] == undefined){
			this.data1[data1Counter] = [];
		}
		this.data1[data1Counter].push(data[i]);
		
	}
	this.data1Length = this.data1.length;
	var tagids = getTagid(data);
	var tagid = [];
	tagid = tagids.unique();
	for(var i = 0; i < tagid.length; i ++){
		$("#tagid").append("<input type='radio' name='tag_id' onclick='drawTrace(" + tagid[i] + ")' value='" + tagid[i] + "'>" + tagid[i]);
	}
}
History.prototype.getFinalData = function(tag_id){//得到tag_id的最终的数据
	containerTarget.removeAllChildren();
	var dataFinal = [];//data1的适配，将data1转换为json数组
	for(var i = 0;i < this.data1.length;i ++){
		for(var j = 0;j < this.data1[i].length;j ++){
			if(this.data1[i][j].tag_id == tag_id){
				dataFinal.push({seqid:i,moveid:this.data1[i][j].tag_id,refid:this.data1[i][j].nodeid,rssi:this.data1[i][j].rssi,time:this.data1[i][j].time});
			}
		}
	}
	this.data = [];
	this.data = dataFinal;
	this.calPoint();
}
History.prototype.addNode  = function(node){
	this._node.push(node);
}
History.prototype.setTagId = function(tag_id){
	this.tag_id = tag_id;
}
History.prototype.calPoint = function(){
	for(var m = 0; m < this.data1Length;m ++){
		var target = new Target(targetImg);
		target.setTagId(this.tag_id);
		for(var i = 0; i < this.data.length; i ++){
			if(this.data[i].seqid == this._curId){
				for(var j = 0; j < this._node.length; j ++){
					if(this._node[j].nodeId == this.data[i].refid){
						target.addRssi(this._node[j],this.data[i].rssi);
						target.setTime(this.data[i].time);
					}
				}
			}
		}
		var data = target.calSimpleZhixin();
//		var startPoint;
//		if(this._curId == 1){
//			startPoint = new Point(target.ox,target.oy);
//			this.line.setStartPoint(startPoint);
//		}else{
//			endPoint   = new Point(target.ox,target.oy);
//			this.line.setEndPoint(endPoint);
//			this.line.drawLine();
//			this.line.setStartPoint(endPoint);
//		}
		
		console.log("DATA" + data);
		target.drawTraceTarget();
		this._curId++;
		stage.update();
	}
	var cL = containerTarget.getNumChildren();
	var c = 0;
	var showTimer = setInterval(function(){
		if(c < cL){
			containerTarget.getChildAt(c).visible = true;
			c++;
		}else{
			clearInterval(cL);
		}
		
	},100);
}
function sleep(d){
	  for(var t = Date.now();Date.now() - t <= d;);
	} 
function getTagid(data){
	var tagid = [];
	for(var i = 0; i < data.length; i ++){
		tagid.push(data[i].tag_id);
	}
	return tagid;
}