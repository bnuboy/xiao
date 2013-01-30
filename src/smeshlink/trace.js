/*
 * 历史轨迹页面加载背景，节点等图片
 */
var loader;
var nodePos = Array();
var targetImg;
var backgroundImg;
var nodeImg;
var history;
var node = [];
var stage;
var containerTarget = new createjs.Container();
function init() {
	$("#startDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#endDate").datepicker({ dateFormat: "yy-mm-dd" });
	$("#starttime").ptTimeSelect();
	$("#endtime").ptTimeSelect();
	initRpc();
	canvas = document.getElementById("canvas");
	container = new createjs.Container();
	stage = new createjs.Stage(canvas);
	history = new History();
	createjs.Touch.enable(stage);
	targetImg = "img/t.png";
	nodeImg   = "img/n.png";
	backgroundImg = "/bg.jpg";
	var manifest = [
	    {src:backgroundImg},
	    {src:nodeImg},
	    {src:targetImg}
	    ];
	loader = new PreloadJS();
    loader.onFileLoad = handleFileLoad;
    loader.onComplete = handleComplete;
    loader.loadManifest(manifest);
}
function update(){
	stage.update();
}
function handleFileLoad(){
}
function handleComplete(){
	var background = new BackGround(backgroundImg);
	containerTarget.x = 0;
	containerTarget.y = 0;
	stage.addChildAt(containerTarget,1);
	setInterval(update,100);
	var timerInit = setInterval(function(){
		if(nodeNumbers == 0){
			initRpc();
		}
		if(init_flag){
			console.log("初始化完成");
			for(var i = 0; i < nodePos.length; i++)
			{
				node[i] = new Node(nodePos[i].id,nodePos[i].x,nodePos[i].y,nodeImg);
				background.addNode(node[i]);
				history.addNode(node[i]);
			}
		clearInterval(timerInit);
		}else{
			console.log("初始化未完成");
		}
	},1000);
}
function drawTrace(tag_id){
	history.setTagId(tag_id);
	history._curId = 0;
	history.getFinalData(tag_id)
}