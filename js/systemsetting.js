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
var currentPage = 1;
$(function(){
	var host = document.location.host;
	uri = "http://" + host + "/xmlrpc";
	client=new XMLRPCClient(uri);
	selectType();
	var $checkbox = $("#all");
	$checkbox.change(all);
});
// select type  set type  select nodeid
function selectType(){ 
   msg=new XMLRPCMessage("ConfigService.getConfigs");
   try{
		client.send(msg.xml(),true,filSelType);
	   }catch(x){
		alert(x);   
	}
}
var $sen;
function all(){
	if($("#sensor").val() != "65535"){
		$sen = $("#sensor").val();
	}
	if($("#sensor").attr("disabled") == "disabled"){
		$("#sensor").removeAttr("disabled");
		$("#sensor").val($sen);
	}else{
		$("#sensor").val("65535");
		$("#sensor").attr("disabled","disabled");
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
	var nodes = $("#sensor");
	nodes.empty();
	var nodes=document.getElementById("sensor");
	var array=resp.value();
	console.log(array);
	for(var i=0;i<array.length;i++){
		var struct=array[i];
		nodes.options[i] = new Option(struct["nodeid"],struct["nodeid"]);	
	}
	nodes.options[nodes.options.length] = new Option("所有节点","all");
}
function nodeTypeChanged(){
	var selType=document.getElementById("selType").value; 
	setConfig(selType); 
}
function updateRate(){
	var add  = $("#sensor").val();
	var rate = $("#rate").val();
	msg.setMethod("smeshserver.set_rate");
	msg.params = Array(parseInt(add),parseInt(rate));
	try{
		client.send(msg.xml(),true,ratecallback);
	}catch(x){
		alert(x);   
	}
}
function ratecallback(req){
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
function customCommand(){
	var add  = $("#sensor").val();
	var customType = $("#customType").val();
	var customValue = $("#customValue").val();
	msg.setMethod("smeshserver.custom_action");
	msg.params = Array(parseInt(add),customType,customValue);
	try{
		client.send(msg.xml(),true,ratecallback);
	}catch(x){
		alert(x);   
	}
}
function reset(){
	var add  = $("#sensor").val();
	msg.setMethod("smeshserver.reset");
	msg.params = Array(parseInt(add));
	try{
		client.send(msg.xml(),true,ratecallback);
	}catch(x){
		alert(x);   
	}
}
function multiCom(){
	var add  = $("#sensor").val();
	var type0 = $("#type0").val();
	var type1 = $("#type1").val();
	var type2 = $("#type2").val();
	var type3 = $("#type3").val();
	var type4 = $("#type4").val();
	var com0 = $("#com0").val();
	var com1 = $("#com1").val();
	var com2 = $("#com2").val();
	var com3 = $("#com3").val();
	var com4 = $("#com4").val();
	if(com0 == ""){
		com0 = 0;
	}
	if(com1 == ""){
		com1 = 0;
	}
	if(com2 == ""){
		com2 = 0;
	}
	if(com3 == ""){
		com3 = 0;
	}
	if(com4 == ""){
		com4 = 0;
	}
	msg.setMethod("smeshserver.set_multi_rate");
	msg.params = Array(parseInt(add),parseInt(type0),parseInt(com0),parseInt(type1),parseInt(com1),parseInt(type2),parseInt(com2),parseInt(type3),parseInt(com3),parseInt(type4),parseInt(com4));
	try{
		client.send(msg.xml(),true,comcallback);
	}catch(x){
		alert(x);   
	}
}
function comcallback(req){
	resp = new XMLRPCResponse(req);
	if(resp.faultCode()){
		return;
	}
	var array = resp.value();
	if(array['result'] == "success"){
		alert("更新成功");
	}else{
		alert("更新失败，请确认参数填写正确");
	}
}