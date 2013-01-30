var uri= "";//"http://127.0.0.1:800/xmlrpc";
var msg;
var client= null;//new XMLRPCClient(uri);
var req;
var resp;
var init_flag = false;
var rssi_flag = false;
var globalRssi;
var nodeNumbers = 0;   //记录节点的总数
var nodeCounter = 0;  //记录当前是第几个节点
var parentNode =  [];
var nodeInfo = new HashMap();//记录节点的详细信息
/*
 * 初始化完成之后，每隔一段时间查询一次是否有新节点接入
 */
function getNodes(){
	msg.setMethod("NodeData.getLatestData");
	//msg.params = Array("RSSI Status");
	try{
		client.send(msg.xml(),true,handleNodes);
	}catch(x){
		alert(x);
	}
}
function handleNodes(req){
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	var array = resp.value();
	if(array == undefined){
		return;
	}
	console.log(nodePos);
	console.log(array);
	for(var i = 0; i < array.length; i++){
		var breakFlag = false;
		for(var j = 0; j < nodePos.length; j++){
			if(nodePos[j].id == array[i].nodeid){
				breakFlag = true;
				break;
			}
		}
		if(!breakFlag){
			var time   = array[i].time;
			time = time.replace(/-/g,"/");
			var timeDiff = new Time(time,new Date()).timeDiff();
			if(timeDiff < 30 * 60){
				node[nodeNumbers] = new Node(array[i].nodeid,25,25,nodeImg);
				nodeMap.put(node[nodeNumbers].nodeId, node[nodeNumbers]);
				getIds += array[i].nodeid + " ";
				background.addNode(node[nodeNumbers]);
				nodePos.push({id:array[i].nodeid,x:25,y:25});
				nodeNumbers++;
			}
		}
	}
}
function selectType(){ 
	var host = document.location.host;
	uri = "http://" + host + "/xmlrpc";
	client=new XMLRPCClient(uri);
	msg=new XMLRPCMessage("NodeData.getAllNodeIds");
	try{
		client.send(msg.xml(),true,handleNodeIds);
	   }catch(x){
		alert(x);   
	}
}  
function handleNodeIds(req){
	console.log("handleNodeIds");
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
		 console.log("error");
		 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		 return;
	}
	var array = resp.value();
	console.log("nodeinfo:");
	console.log(array);
	
	if(array.length == 0){
		init_flag = true;
	}
	for(var i=0;i<array.length;i++){
		var struct = array[i];
		var nodeid = struct["nodeid"];
		var time   = struct["time"];
		var parent = struct["parent"];
		
		if(parentNode.inArray(parent)){
			console.log("in");
		}else{
			console.log("parent" + parent);
			parentNode.push(parent);
			nodeNumbers ++;
			msg.setMethod("TopData.existnode");
			msg.params = Array("" + parent);
			for(var m = 0; m < 500;m ++){
				
			}
			try{
				client.send(msg.xml(), true, handleExist, parent);
			}catch(x){
				alert(x);
			}
		}
		time = time.replace(/-/g,"/");
		var timeDiff = new Time(time,new Date()).timeDiff();
		if(timeDiff < 30 * 60){
			nodeInfo.put(nodeid, struct);
			nodeNumbers++;
			msg.setMethod("TopData.existnode");
			msg.params = Array("" + nodeid);
			for(var m = 0; m < 500;m ++){
				
			}
			try{
				client.send(msg.xml(), true, handleExist, nodeid);
			}catch(x){
				alert(x);
			}
		}
		console.log(nodeNumbers);
		if(nodeNumbers == 0){
			init_flag = true;
		}
		
	}
}
function handleExist(req){
	id = req.context;
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	var array = resp.value();
	if(array == undefined){
		alert("程序出错，请刷新");
	}
	if(array.toString() == "true"){
		requestTopology(id);
	}else{
		nodePos.push({id:id,x:100,y:100});
		nodeCounter++;
	}
	stage.update();
}
function requestTopology(id){
	msg.setMethod("TopData.getTopology");
	msg.params = [id];
	try{
		client.send(msg.xml(), true,handleTopology);
	}catch(x){
		alert(x);
	}
}
function handleTopology(req){
	resp=new XMLRPCResponse(req);
	
	if(resp.faultCode()){
		 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		 return;
	}
	var array = resp.value();
	nodePos.push({id:array.nodeid,x:array.xPos,y:array.yPos});
	nodeCounter++;
	console.log(nodeNumbers);
	console.log(nodeCounter);
	if(nodeCounter == nodeNumbers){
		init_flag = true;
	}
}
function getRssi(getIds){
	msg.setMethod("NodeData.getAllNodes");
	var date = new Date();
	var timeStampStop = date.getTime();
	var timeStampStart = timeStampStop - 20000;
	var timeStart =   timetodate(timeStampStart,"yyyy-MM-dd hh:mm:ss");
	var timeStop  =   timetodate(timeStampStop,"yyyy-MM-dd hh:mm:ss");
	msg.params = Array("" + timeStart,"" + timeStop,getIds,10000,1,"all");
	try{
		client.send(msg.xml(), true, function(req){handleRssi(req)});
	}catch(x){
		alert(x);
	}
}
function handleRssi(req){
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	rssi_flag = true;
	globalRssi = resp.value();
}
function selectData(){
	 var start = $("#starttime").val();
	 var stop = $("#endtime").val();
	 if(start == null || stop == null || document.getElementById("startDate").value == null || document.getElementById("endDate").value == null){
		 alert("请将日期填写完整");
		 return;
	 }
	 var re = /([0-9]{1,2}).*:.*([0-9]{2}).*(PM|AM)/i;
     var match = re.exec(start);
     if (match) {
         hr    = match[1];
         min    = match[2];
         tm    = match[3];
         if(tm.toLowerCase() == "pm"){
        	 hr = (parseInt(hr) + 12)%24;
         }
         start = "" + hr + ":" + min + ":00";
     }
	 var re = /([0-9]{1,2}).*:.*([0-9]{2}).*(PM|AM)/i;
     var match = re.exec(stop);
     if (match) {
         hr    = match[1];
         min    = match[2];
         tm    = match[3];
         if(tm.toLowerCase() == "pm"){
        	 hr = (parseInt(hr) + 12)%24;
         }
         stop = "" + hr + ":" + min + ":00";
     }
	 
	var getIds = "";
	for(var i = 0; i < node.length; i ++){
		getIds += node[i].nodeId + " ";
	}
	 
     var startTime=document.getElementById("startDate").value+" " + start;
	 var endTime=document.getElementById("endDate").value+" " + stop;
	  msg.setMethod("NodeData.getAllNodes");
	  msg.params=Array(startTime,endTime,getIds,300,1,"all");
	  try{
		  client.send(msg.xml(),true,handleAllData);
	  }catch(x){
		  alert(x);   
	  }
}
function handleAllData(req){
    resp=new XMLRPCResponse(req);
    if(resp.faultCode()){
	    alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
	    return;
	}	
	var array = resp.value();
	history.calData(array);
}