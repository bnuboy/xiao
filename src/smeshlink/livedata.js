var uri= "";
var msg;
var client=null;
var req;
var resp;
var fieldNameArray=[];
var type;
var rowId=1;
var tabArr = [];//存放tab的数组
var tableArr = new HashMap();//存放table的数组
var first = 0;
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
	row.height=30;
	row.className="head";
	
	for(var i=0;i<colNum;i++){		    
	   var innerArray=array[i];
	   var cell=row.insertCell(-1);
	   cell.width=cellWidth;
	   cell.height=30;
	   cell.innerHTML=innerArray[1];	
	   fieldNameArray[i]=innerArray[0];
	}
	//setInterval("handleConfig()",3000);
	getLiveData();
}

function getLiveData(){
	var webSocket = new WebSocket("ws://192.168.0.110:9007/");
	webSocket.onopen = function(event){
		console.log("connected to the server");
	}
	
	webSocket.onmessage = function(event){
		console.log(event.data);
		var data = eval("[" + event.data + "]")[0].data;
		var struct = [];
		var fieldNameArr = [];
		for(var i = 0; i < data.length; i ++){
			fieldNameArr[i] = data[i].alias;
			struct[data[i].alias] = data[i].converted;
		}
		if(tabArr.inArray(eval("[" + event.data + "]")[0].parser)){
			$table = $("#" + eval("[" + event.data + "]")[0].parser.replace(" ","_"));
			var odd = $("#" + eval("[" + event.data + "]")[0].parser.replace(" ","_") + " tr").last().attr("class");
			if(odd == "odd"){
				var str = "<tr class='even'>";
			}else{
				var str = "<tr class='odd'>";
			}
			for(var i = 0; i < fieldNameArr.length; i ++){
				str += "<td>" + struct[fieldNameArr[i]] + "</td>";
			}
			str += "</tr>";
			$table.append(str);
		}else{
			tabArr.push(eval("[" + event.data + "]")[0].parser);
			first ++;
			$("#config ul").append("<li onclick='show(\""+eval("[" + event.data + "]")[0].parser.replace(" ","_") +"\")'>" + eval("[" + event.data + "]")[0].parser + "</li>");
			if(first == 1){
				var str = "<table id='"+ eval("[" + event.data + "]")[0].parser.replace(" ","_") +"' width='100%' cellspacing='1' cellpadding='0' border='0' bgcolor='#696969' style='display:table;'><tr class='head'>";
			}else{
				var str = "<table id='"+ eval("[" + event.data + "]")[0].parser.replace(" ","_") +"' width='100%' cellspacing='1' cellpadding='0' border='0' bgcolor='#696969'><tr class='head'>";
			}
			for(var i = 0; i < fieldNameArr.length; i ++){
				str += "<td>" + fieldNameArr[i] + "</td>";
			}
			str += "</tr><tr class='odd'>";
			for(var i = 0; i < fieldNameArr.length; i ++){
				str += "<td>" + struct[fieldNameArr[i]] + "</td>";
			}
			str += "</tr></table>";
			$("#data").append(str);
			//tableArr.put(eval("[" + event.data + "]")[0].parser, str);
		}
		if(eval("[" + event.data + "]")[0].parser != eval("[" + event.data + "]")[0].parser){
			return;
		}
//		var data = eval("[" + event.data + "]")[0].data;
//		var struct = [];
//		for(var i = 0; i < data.length; i ++){
//			struct[data[i].name] = data[i].converted;
//		}

//		var table=document.getElementById("table");
//		var remainder=table.width%colNum;
//		var cellWidth=(table.width-remainder)/colNum;
//		for(var i=0;i<data.length;i++){
//			var row=table.insertRow(-1);
//			row.height=25;
//			if(rowId%2==0){
//				row.className="even";
//			}else{		
//				row.className="odd";	
//			}
//			for(var j=0;j<colNum;j++){
//				var cell=row.insertCell(-1);
//				cell.width=cellWidth;
//				cell.height=25;
//				var structName=fieldNameArray[j];
//				console.log("struct",struct);
//				cell.innerHTML=struct[structName];	  
//			} 
//			rowId++;
//	   }
	}
}
function show(str){
	$("#data table").hide();
	$("#" + str).show();
}