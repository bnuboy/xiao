var loader;
var tempid = Array();
var nodePos = Array();
var targetImg;
var backgroundImg;
var nodeImg;
var updatePeriod = 100;
var locationPeriod = 1000;
var nodeMap = new HashMap();
var lineMap = new HashMap();//存储子节点的lineMap
var lineInfo = new HashMap();
var baseLineMap = new HashMap();//存储base节点的lineMap
var node = [];
var getIds = "";
var background;
var stage;
var lines = [];
var line_color = "#000000";
var containerNode = new createjs.Container();
var containerLine = new createjs.Container();
var testCallback = function(){
	console.log("call back");
}
function init() {
	if(getCookie("islogin") == null){
		alert("请先登录");
		location.href="index.html";
	}
	selectType();
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);
	
	targetImg = "img/base.png";
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
	
	background = new BackGround(backgroundImg);
	containerLine.x = 0;
	containerLine.y = 0;
	stage.addChildAt(containerLine,1);
	containerNode.x = 0;
	containerNode.y = 0;
	stage.addChildAt(containerNode,2);
	setInterval(update,updatePeriod);
	
	var timerInit = setInterval(function(){
		if(nodeNumbers == 0){
			selectType();
		}
		if(init_flag){
			console.log("初始化完成");
			document.getElementById("hint").innerHTML = "资源加载完毕";
			setInterval(function(){getNodes();},1000*3);
			
			for(var i = 0; i < nodePos.length; i++)
			{
				if(parentNode.inArray(nodePos[i].id)){
					//判断nodeid是否在baseid数组里面，如果在，说明此点为base
					node[i] = new Base(nodePos[i].id,nodePos[i].x,nodePos[i].y,targetImg);
					nodeMap.put(node[i].nodeId, node[i]);
					background.addNode(node[i]);
				}else{
					node[i] = new Node(nodePos[i].id,nodePos[i].x,nodePos[i].y,nodeImg);
					nodeMap.put(node[i].nodeId, node[i]);
					getIds += nodePos[i].id + " ";
					background.addNode(node[i]);
				}
			}
			
			for(var i = 0; i < nodePos.length; i++)
			{
				if(parentNode.inArray(nodePos[i].id)){
					//判断nodeid是否在baseid数组里面，如果在，说明此点为base
				}else{
					//var line = new createjs.Shape();
					var line = new Line("#000");
					var parent = nodeInfo.get(nodePos[i].id).parent;
					//line.graphics.clear().setStrokeStyle(1,"round").beginStroke("#000").moveTo(nodeMap.get(nodePos[i].id).x,nodeMap.get(nodePos[i].id).y).lineTo(nodeMap.get(parent).x,nodeMap.get(parent).y);
					line.setStartPoint(new Point(nodeMap.get(parent).x,nodeMap.get(parent).y));
					line.setEndPoint(new Point(nodeMap.get(nodePos[i].id).x,nodeMap.get(nodePos[i].id).y));
					line.drawLine();
					nodeMap.get(nodePos[i].id).addLine(line,2);
					nodeMap.get(parent).addLine(line,1);
					//lineMap.put(nodePos[i].id,line);
					//lineInfo.put(nodePos[i].id, [nodeMap.get(nodePos[i].id).x,nodeMap.get(nodePos[i].id).y,nodeMap.get(parent).x,nodeMap.get(parent).y]);
					//nodeMap.get(parent).addLine(line,new Point(nodeMap.get(nodePos[i].id).x,nodeMap.get(nodePos[i].id).y));
					//baseLineMap.push({id:parent,});
					//nodeMap.get(parent).addLine(line,new Point(nodeMap.get(nodePos[i].id).x,nodeMap.get(nodePos[i].id).y));
					//nodeMap.get(nodePos[i].id).addLine(line,new Point(nodeMap.get(parent).x,nodeMap.get(parent).y));
					stage.update();
				}
			}
			clearInterval(timerInit);
		}else{
			console.log("初始化未完成");
			return;
		}
	},1000);
}
function upload(){
	TINY.box.show({url:"uploadBackground.html",openjs:urlFunction,fixed:false})
}
function config(){
	TINY.box.show({url:"config.html",openjs:configInit,fixed:false});
}
function configInit(){
	var nodeSelector = document.getElementById("node");
	for(var i = 0; i < nodeMap.size(); ){
		nodeSelector.options[i] = new Option("节点:" + nodeMap.get(++i).nodeId + "    ",nodeMap.get(i).nodeId);
	}
}

var url;
function urlFunction(){
	url = "http://" + document.location.hostname + ":8080/bg";
	document.forms[0].action = url;
}