var seriesOptions = [];
var yAxisOptions = [];
var seriesCounter = 0;
var	names = ['MSFT', 'AAPL', 'GOOG'];
var uri= "";//"http://127.0.0.1:800/xmlrpc";
var msg;
var client= null;//new XMLRPCClient(uri);
var req;
var resp;
var tolPages;
var currentPage=1;
var fieldNameArray=[];
var colNum;
var startTime;
var endTime;
var s = 0;
var totalPage = 0;
var pageNumber = 0;
var pageCounter = 0;
var nodeId = [];
//var arrayData = new Array();
var currentPage = 1;
var sensorType;
var obj = {};
var	colors = Highcharts.getOptions().colors;
$(function() {
	if(getCookie("islogin") == null){
		alert("请先登录");
		location.href="index.html";
	}
	var host = document.location.host;
	uri = "http://" + host + "/xmlrpc";
	client=new XMLRPCClient(uri);
	$("#startDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#endDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#starttime").ptTimeSelect();
	$("#endtime").ptTimeSelect();
	selectType();

});
function createChart() {

	chart = new Highcharts.StockChart({
	    chart: {
	        renderTo: 'container'
	    },

	    rangeSelector: {
	        selected: 4
	    },

	    yAxis: {
//	    	labels: {
//	    		formatter: function() {
//	    			return (this.value > 0 ? '+' : '') + this.value + '%';
//	    		}
//	    	},
	    	min: null,
	    	max: null,
	    	startOnTick: true,
	    	endOnTick: true,
	    	plotLines: [{
	    		value: 0,
	    		width: 2,
	    		color: 'silver'
	    	}]
	    },
	    
//	    plotOptions: {
//	    	series: {
//	    		compare: 'percent'
//	    	}
//	    },
	    
	    tooltip: {
	    	pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
	    	valueDecimals: 2
	    },
	    
	    series: seriesOptions
	});
}
function selectType(){ 
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
	var typeSel=document.getElementById("selType");
	var array=resp.value();
	//typeSel.options[0].value=array[0];
	typeSel.options[0]=new Option(array[0],array[0]);
	for(var i=1;i<array.length;i++){
		 typeSel.options[typeSel.options.length]=new Option(array[i],array[i]);
		}
	//var typeSel=document.getElementById("selType");
	var params=typeSel.options[0].value;
	setConfig(params);
}
function setConfig(params){
		
   msg.setMethod("ConfigService.setConfig");
   msg.params=Array(params);
   try{
		client.send(msg.xml(),true,getNodeIds);
	   }catch(x){
		alert(x);   
	  }

}
function getNodeIds(req){
	   
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
			 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
			 return;
			}
	if(resp.value().toString()=="true"){
		  msg.setMethod("NodeData.getNodeIds");
		  msg.params=Array("all");
		  try{
			   client.send(msg.xml(),true,filCheckNodes);
			  }catch(x){
			 alert(x);   
		}
		  
	}
}
function filCheckNodes(req){
	resp=new XMLRPCResponse(req);
	if(resp.faultCode()){
			 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
			 return;
			}		
	var nodes=document.getElementById("nodeArea");
	var array=resp.value();
	for(var i=0;i<array.length;i++){
		var struct=array[i];
		nodes.innerHTML+="<li><input type='checkbox' name='nodeId' value="+ struct["nodeid"]+" /><label>节点"+struct["nodeid"]+" </label></li>";	
	}
	selectFieldsName();
}
function selectFieldsName(){
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
			
	var table=document.createElement("table");	
	table.id="table";
	table.border=0;
	table.bgColor="#000";
	table.cellPadding=0;
	table.cellSpacing=1;		 
	table.width="100%";
   
	var section=document.getElementById("data");
	section.appendChild(table);
	
	var array=resp.value();
	colNum=array.length;
	var remainder=table.width%colNum;
	var cellWidth=(table.width-remainder)/colNum;
	
	var row=table.insertRow(-1);
	row.height=30;
	row.className="head";
	var sensor=$("#sensor");
	var array=resp.value();
	sensor.empty();
	sensor.append(new Option(array[0][0],array[0][0]));
	sensorType = array[0][0];
	for(var i=1;i<array.length;i++){
		sensor.append(new Option(array[i][0],array[i][0]));
	}
}

function nodeTypeChanged(){
   var table=document.getElementById("table");
   if(table!=null){
	  table.parentNode.removeChild(table);
	  var nodeSpan=document.getElementById("nodeArea");
	  nodeSpan.innerHTML="";
	  var selType=document.getElementById("selType").value; 
	  setConfig(selType); 
	   }
}
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
     startTime=document.getElementById("startDate").value+" " + start;
	 endTime=document.getElementById("endDate").value+" " + stop;
	 var inputs=document.getElementsByTagName("input");
	 nodeId = [];
	 seriesOptions = [];
	 s = 0;
	 obj = {};
	 for(var i=0;i<inputs.length;i++){
		  if(inputs[i].type=="checkbox"&&inputs[i].checked){
			  console.log(inputs[i].value+" ");				       
			  nodeId.push(inputs[i].value);
		  }			 
	 }
	  msg.setMethod("NodeData.getTotalPages");
	  $.each(nodeId,function(i,id){
		  msg.params=Array(startTime,endTime,id,50,"all");
		  try{
			   client.send(msg.xml(),true,handlePages,id);
		  }catch(x){
			   alert(x);   
		  }	
	  });
	  	
}
function handlePages(req){
   console.log("handlePanges");
   resp=new XMLRPCResponse(req);
   if(resp.faultCode()){
			 alert(" ERROR: /n"+ "faultCode:"+resp.faultCode()+" /n faultString:"+resp.faultString());
			 return;
			}	
    var array=resp.value();
	pageNumber = array;// 总页数
	totalPage += pageNumber;
	console.log(totalPage);
	for(var i = 1;i <= pageNumber;i++){
		
		getnPage(i,req.context);
	}
}
function getnPage(npage,id){
	msg.setMethod("NodeData.getAllNodes");
	msg.params=Array(startTime,endTime,id,50,npage,"all");
	try{
		client.send(msg.xml(),true,handleSinglePageData,id,npage);
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
	
	var arrayData = [];
	for(var a = array.length - 1; a >= 0; a --){
		var newarray = [];
		//var timeTemp = parseInt(array[a].time.replace(/-/g,"/"));
		newarray[0] = new Date(array[a].time.replace(/-/g,"/")).getTime() + 8*60*60*1000;
		//newarray[1] =  new Date(array[a][sensorType].replace(/-/g,"/")).getTime();
		newarray[1] =  array[a][sensorType];
		arrayData.push(newarray);
	}
	if(obj[req.context] == null){
		obj[req.context] = new HashMap();
	}
	obj[req.context].put(req.npage,arrayData);
	console.log(req.context + "--------" +req.npage);
	pageCounter++;
	console.log(pageCounter);
	if(pageCounter >= totalPage){
		console.log("vvv");
		var s = 0;
		for(var o in obj){
			var data = obj[o];
			console.log(data);
			var size = data.size();
			var temparr = [];
			for(var n = size; n > 0; n --){
				temparr = temparr.concat(data.get(n));
			}
			seriesOptions[s++] = {
					name:"nodeId" + o,
					data:temparr
			}
		}
		createChart();
		console.log("seriesOptions");
		console.log(seriesOptions);
		
	}
}
function sensorChange(){
	sensorType = $("#sensor").val();
}