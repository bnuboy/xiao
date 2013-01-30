$(function(){
	if(getCookie("islogin") == null){
		alert("请先登录");
		location.href="index.html";
	}
	initRpc();
	
});
