/*
 * 通过rpc获取历史数据
 */
var uri= "";
var msg;
var client=null;
var req;
var resp;
var init_flag = false;
var rssi_flag = false;
var globalRssi;
var nodeNumbers = 0;   // 记录节点的总数
var nodeCounter = 0;  // 记录当前是第几个节点
var startTime;
var endTime;
var ids;
var pageNumber = 0;
var pageCounter = 0;
var arrayData = [];
function initRpc(){ 
	var host = document.location.host;
	uri = "http://" + host + "/xmlrpc";
	client=new XMLRPCClient(uri);
    msg=new XMLRPCMessage("ConfigService.getConfigs");
	try{
		client.send(msg.xml(),true,setConfig);
	   }catch(x){
		alert(x);   
	}
}
function setConfig(req){ 
	resp=new XMLRPCResponse(req);
	
	if(resp.faultCode()){
			 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
			 return;
			}
	msg.setMethod("ConfigService.setConfig");
	msg.params = Array("RSSI Packet");
	try{
		client.send(msg.xml(),true,handleConfig);
	   }catch(x){
		alert(x);   
	}
}
function getNodes(){
	msg.setMethod("NodeData.getLatestData");
	msg.params = Array("RSSI Status");
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
			node[nodeNumbers] = new Node(array[i].nodeid,25,25,nodeImg);
			nodeMap.put(node[nodeNumbers].nodeId, node[nodeNumbers]);
			getIds += array[i].nodeid + " ";
			background.addNode(node[nodeNumbers]);
			nodePos.push({id:array[i].nodeid,x:25,y:25});
			nodeNumbers++;
		}
	}
}
function handleConfig(req){
	// msg.setMethod("NodeData.getNodeIds");
	// msg.params = Array("all");
	msg.setMethod("NodeData.getLatestData");
	msg.params = Array("RSSI Status");
	try{
		client.send(msg.xml(), true, handleNodeIds);
	}catch(x){
		alert(x);
	}
}
function handleNodeIds(req){
	resp=new XMLRPCResponse(req);
	
	if(resp.faultCode()){
		 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		 return;
	}
	var array = resp.value();
	// nodeNumbers = array.length;
	for(var i=0;i<array.length;i++){
		var struct=array[i];
		var nodeid = struct["nodeid"];
		var time   = struct["time"];
		time = time.replace(/-/g,"/");
		var timeDiff = new Time(time,new Date()).timeDiff();
		
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
// 点击查询按钮，将查询时间内的历史数据获取
function selectData(){
	 var start = $("#starttime").val();
	 var stop = $("#endtime").val();
	 if(start == "" || stop == "" || document.getElementById("startDate").value == "" || document.getElementById("endDate").value == ""){
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
     var stop = $("#endtime").val();
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
	 ids = getIds;
     startTime=document.getElementById("startDate").value+" " + start;
	 endTime=document.getElementById("endDate").value+" " + stop;
	 getPages(50,"all");
}
function getPages(number,who){
	msg.setMethod("NodeData.getTotalPages");
	msg.params=Array(startTime,endTime,ids,number,who);
	try{
	   client.send(msg.xml(),true,handlePages);
	}catch(x){
	   alert(x);   
	} 
}
function handlePages(req){
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	var array = resp.value();
	pageNumber = array;// 总页数
	for(var i = 1;i <= array;i++){
		getnPage(i);
	}
}
function getnPage(npage){
	msg.setMethod("NodeData.getAllNodes");
	msg.params=Array(startTime,endTime,ids,50,npage,"all");
	try{
		client.send(msg.xml(),true,handleSinglePageData);
	}catch(x){
		alert(x);   
	}
}
function handleSinglePageData(req){
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
		alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		return;
	}	
	var array = resp.value();
	arrayData = arrayData.concat(array);
	pageCounter++;
	if(pageCounter == pageNumber){
		history.calData(arrayData); 
	}
}
// function handleAllData(req){
// resp=new XMLRPCResponse(req);
// if(resp.faultCode()){
// alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n
// faultString:"+resp.faultString());
// return;
// }
// var array = resp.value();
// history.calData(array);
//		
// }
