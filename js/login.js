var uri;
var msg;
var client=null;
function loginCheck(){
	var userName=document.getElementById("userName").value;
	var password=document.getElementById("password").value;
	if(userName==""||password==""){
		alert("用户名和密码不能为空");
	  	return;
	}
	var host = document.location.host;
	uri = "http://" + host + "/xmlrpc";
	client=new XMLRPCClient(uri);
	msg = new XMLRPCMessage("UserData.getUserId", Array(userName,password));	  
	client = new XMLRPCClient(uri);   
	try {
		client.send(msg.xml(), true, check);
	} catch (x) {
		alert(x);
	}		 
}
function check(request)
{
	var response = new XMLRPCResponse(request);
	if (response.faultCode()) {
		alert("Error:\n" + "faultCode:" + resp.faultCode() + "\n" + "faultString:" + resp.faultString());
		return;
	}
	var arr = response.value();
	if(parseInt(response.value().toString())!=0){
		var uid = parseInt(response.value().toString());
		setCookie("islogin","true");
		msg.setMethod("UserData.getUserMsg");
		var a = [uid];
		msg.params = a;
		try {
			client.send(msg.xml(), true, usertype);
		} catch (x) {
			alert(x);
		}	
		
	}else{
		alert("您的用户名和密码不对！");
	}
}
function cancel(){
	var userName=document.getElementById("userName");
	var password=document.getElementById("password");
	userName.value="";
	password.value="";
   
}
function usertype(req){
	var resp = new XMLRPCResponse(req);
	var arr = resp.value();
	var roleId = arr.roleId;
	setCookie("roleId",roleId);
//	location.href="livedata.html";
	$.get("livedata.html",function(data){
		$("#main").html(data);
	});
}