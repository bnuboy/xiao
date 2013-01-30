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
/*
 * 初始化完成之后，每隔一段时间查询一次是否有新节点接入
 */
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
    msg=new XMLRPCMessage("ConfigService.getConfigs");
	try{
		client.send(msg.xml(),true,filSelType);
	   }catch(x){
		alert(x);   
	}
}  
function filSelType(req){ 
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

function handleConfig(req){//根据_l表获得共有多少个点
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
	for(var i=0;i<array.length;i++){
		var struct=array[i];
		var nodeid = struct["nodeid"];
		var time   = struct["time"];
		var parent = struct["PARENT"];
		lineMap.put(nodeid, parent);
		time = time.replace(/-/g,"/");
		var timeDiff = new Time(time,new Date()).timeDiff();
		if(timeDiff < 30 * 60){
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
	if(nodeNumbers == 0){
		init_flag = true;
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
function updateConfig(){
	var nid = document.getElementById("node").value;
	var description = document.getElementById("description").value;
	var url = document.getElementById("url").value;
	var longitude = document.getElementById("longitude").value;
	var latitude   = document.getElementById("latitude").value;
	msg.setMethod("TopData.changeDescription");
	msg.params = Array(description,url,longitude,latitude,parseInt(nid));
	try{
		client.send(msg.xml(), true,updateConfigcallback);
	}catch(x){
		alert(x);
	}
}
function updateConfigcallback(req){
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	var array = resp.value();
	if(array.toString() == "true"){
		alert("更新成功");
	}else{
		alert("更新失败，请确认参数填写正确");
	}
}