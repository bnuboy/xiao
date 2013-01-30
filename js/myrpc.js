/**
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
var type;
var fieldNameArray=[];
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
	var value = resp.value();
	if(resp.faultCode()){
		alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		return;
	}
	var seltype = document.getElementById("seltype");
	for(var i = 0; i < value.length; i ++){
		seltype.options[i] = new Option(value[i],value[i]);
	}
	sendConfig(seltype.options[0]);
}
function sendConfig(obj){
	type = obj.value;
	msg.setMethod("ConfigService.setConfig");
	msg.params = Array(type);
	try{
		client.send(msg.xml(),true,selectFieldsName);
	}catch(x){
		alert(x);   
	}
}
function selectFieldsName(req){
	msg.setMethod("ConfigService.getFieldNames");
	msg.params=[];
	try{
		client.send(msg.xml(),true,filTabField);
	}catch(x){
		alert(x);   
	}
}
function filTabField(req){
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
		alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		return;
	}
	var section=document.getElementById("data");
	var table = document.getElementById("table");
	if(table == undefined){
		table=document.createElement("table");
	}else {
		section.removeChild(table);	
		table=document.createElement("table");
	}
	table.id="table";
	table.border=0;
	table.bgColor="#000";
	table.cellPadding=0;
	table.cellSpacing=1;		 
	table.width="100%";
	
	section.appendChild(table);
	var array=resp.value();
	console.log(array);
	colNum=array.length;
	var remainder=table.width%colNum;
	var cellWidth=(table.width-remainder)/colNum;
	
	var row=table.insertRow(-1);
	row.height=25;
	row.className="head";
	
	for(var i=0;i<colNum;i++){		    
	   var innerArray=array[i];
	   var cell=row.insertCell(-1);
	   cell.width=cellWidth;
	   cell.height=25;
	   cell.innerHTML=innerArray[1];	
	   fieldNameArray[i]=innerArray[0];
	}
	setInterval("handleConfig()",3000);
}
function handleConfig(){
	msg.setMethod("NodeData.getLatestData");
	try{
		client.send(msg.xml(), true, fillTables);
	}catch(x){
		alert(x);
	}
}

function fillTables(req){
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
		alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
		return;
	}	
	var table=document.getElementById("table");
	for(var i=table.rows.length-1;i>0;i--){
		table.deleteRow(i);
	}
	var rowId=1;
	//rowNum  
	var array=resp.value();
	//colNum
	var remainder=table.width%colNum;
	var cellWidth=(table.width-remainder)/colNum;
	for(var i=0;i<array.length;i++){
		var row=table.insertRow(-1);
		row.height=20;
		if(rowId%2==0){
			row.className="even";
		}else{		
			row.className="odd";	
		}
		for(var j=0;j<colNum;j++){
			var cell=row.insertCell(-1);
			cell.width=cellWidth;
			cell.height=20;
			var structName=fieldNameArray[j];
			var struct=array[i];
			console.log("struct",struct);
			cell.innerHTML=struct[structName];	  
		} 
		rowId++;
   }
}