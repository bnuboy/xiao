function History(){
	this._curId = 0;
	this._node = [];
	this._target = [];
	this.tag_id = 0;
	this.data1Length = 0;
	this.data = new Array();
	this.data1 = [];   //将data进行分组，每5秒一组数，数组的长度就是每个tagid的位置数目
	this.line = new Line("#000000");
	//this.time;
}
History.prototype.startTrace = function(){
	var his = this;
	this.time = setInterval(function(){his.calPoint();},1000);
}
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
	//console.log(data1);
	this.data1Length = this.data1.length;
	
	var tagids = getTagid(data);
	var tagid = [];
	tagid = tagids.unique();
	for(var i = 0; i < tagid.length; i ++){
		$("#tagid").append("<input type='radio' name='tag_id' onclick='drawTrace(" + tagid[i] + ")' value='" + tagid[i] + "'>" + tagid[i]);
	}
	//this.getFinalData(data1);
//	console.log(dataFinal);
	//this.data = dataFinal;
	//this.calPoint();
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
	console.log(this.data);
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
		
		console.log(data);
		target.drawTraceTarget();
		this._curId++;
		//setTimeout(function(){target.drawTraceTarget();},100);
		stage.update();
		sleep(5);
	}
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
History.prototype.getData = function(){
	var data = [
		{seqid:0,moveid:1,refid:1,rssi:100},
		{seqid:0,moveid:1,refid:2,rssi:200},
		{seqid:0,moveid:1,refid:4,rssi:100},       
	    {seqid:1,moveid:1,refid:1,rssi:100},
	    {seqid:1,moveid:1,refid:2,rssi:200},
	    {seqid:1,moveid:1,refid:4,rssi:100},
	    {seqid:2,moveid:1,refid:1,rssi:200},
	    {seqid:2,moveid:1,refid:2,rssi:100},
	    {seqid:2,moveid:1,refid:5,rssi:100},
	    {seqid:3,moveid:1,refid:2,rssi:300},
	    {seqid:3,moveid:1,refid:3,rssi:100},
	    {seqid:3,moveid:1,refid:4,rssi:100},
	    {seqid:4,moveid:1,refid:2,rssi:100},
	    {seqid:4,moveid:1,refid:3,rssi:100},
	    {seqid:4,moveid:1,refid:5,rssi:300},
	    {seqid:5,moveid:1,refid:2,rssi:100},
	    {seqid:5,moveid:1,refid:3,rssi:100},
	    {seqid:5,moveid:1,refid:6,rssi:300},
	    {seqid:6,moveid:1,refid:1,rssi:100},
	    {seqid:6,moveid:1,refid:2,rssi:100},
	    {seqid:6,moveid:1,refid:3,rssi:300},
	    {seqid:7,moveid:1,refid:1,rssi:100},
	    {seqid:7,moveid:1,refid:2,rssi:300},
	    {seqid:7,moveid:1,refid:3,rssi:100},
	    {seqid:8,moveid:1,refid:1,rssi:100},
	    {seqid:8,moveid:1,refid:3,rssi:200},
	    {seqid:8,moveid:1,refid:4,rssi:100},
	    {seqid:9,moveid:1,refid:1,rssi:100},
	    {seqid:9,moveid:1,refid:3,rssi:100},
	    {seqid:9,moveid:1,refid:4,rssi:400},
	    {seqid:10,moveid:1,refid:1,rssi:100},
	    {seqid:10,moveid:1,refid:2,rssi:100},
	    {seqid:10,moveid:1,refid:4,rssi:400},
	    {seqid:11,moveid:1,refid:2,rssi:200},
	    {seqid:11,moveid:1,refid:5,rssi:100},
	    {seqid:11,moveid:1,refid:4,rssi:100},
	    {seqid:12,moveid:1,refid:2,rssi:100},
	    {seqid:12,moveid:1,refid:6,rssi:100},
	    {seqid:12,moveid:1,refid:4,rssi:300}
	    ];
	return data;
//	this.data = data;
}