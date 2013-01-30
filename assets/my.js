var txtTemp;
var txt;
var txtInfo;
var canvas, stage;
var container;
var bitmaps = new Array();
var shape;
var line_color = "#f00";
var txt_color = "#ff0";
var txtInfo_color = "#f00";
var points = new Array();//[[x,y,id,pid],[],...]
var lines;//[[sx,sy,ex,ey,sid,eid],[],...]
var line_no = 0;
var line_tag = new Array();

var map,imap;
var width = 600;   //画布宽度

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;


var timeStart;
var timeEnd;

var bg;
var moveflag = false;
var image;
$(function(){
	var tdTimeStart;
	var tdTimeEnd;
	var tds = $("td");
	tds.each(function(i,m){
		$(m).mousedown(function(){
			//alert(tdTimeStart);
			var tempS = new Date();
			tdTimeStart = tempS.getSeconds();
			
			setTimeout(function(){
				var tempE = new Date();	
				tdTimeEnd = tempE.getSeconds();
				if((tdTimeEnd - tdTimeStart)>=1){
					$(m).removeClass("full");
					bitmaps[i].visible = true;
					txt[i].visible = true;
					update = true;
				}
			},1200);	
		});
		$(m).mouseup(function(){
			var tempS = new Date();
			tdTimeStart = tempS.getSeconds() + 2;
		});
	});
});

function init() {
	if (window.top != window) {
		document.getElementById("header").style.display = "none";
	}
	document.getElementById("loader").className = "loader";
	// create stage and point it to the canvas:
	canvas = document.getElementById("testCanvas");

	//check to see if we are running in a browser with touch support
	stage = new createjs.Stage(canvas);

	// enable touch interactions if supported on the current device:
	createjs.Touch.enable(stage);

	// enabled mouse over / out events
	stage.enableMouseOver(100);
	stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	// load the source image:
	bg = new Image();
	bg.src = "assets/bg.png";
	
	image = new Image();
	//image.src = "assets/node_grey.png";
	image.src = "assets/node.png";
	//image.src = "assets/node.png";
	image.onload = handleImageLoad;
	
	map = new Image();
	map.src = "assets/baidumap.png";
	//map.onload = handleMap;
	
	
}


function stop() {
	Ticker.removeListener(window);
}

function handleImageLoad(event) {
	var image = event.target;
	
	var bg_bitmap = [];
	
	txt = [];
	txtInfo = [];
	lines = [];
	container = new createjs.Container();
	stage.addChild(container);

	
	// create and populate the screen with random daisies:
	for(var i = 0; i < 10; i++){
		bitmap = new createjs.Bitmap(image);
		bitmaps[i] = bitmap;
		container.addChild(bitmap);

		var tempX = ((canvas.width - 200) * Math.random()  + 200)|0;
		var tempY = ((canvas.height - 25) * Math.random() + 25)|0;
		bitmap.x = tempX;
		bitmap.y = tempY;
		bitmap.regX = bitmap.image.width/2|0;
		bitmap.regY = bitmap.image.height/2|0;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = ""+i;


		//my add
		bg_bitmap[i] = new createjs.Bitmap(bg);
		bg_bitmap[i].x = tempX - 25;
		bg_bitmap[i].y = tempY + 25;
		txt[i] = new createjs.Text(bitmap.name, "36px Arial", txt_color);
		txt[i].x = tempX - 10;
		txt[i].y = tempY + 10;
		txt[i].name = bitmap.name;
		txtInfo[i] = new createjs.Text("humid:100\ntemprature:28", "16px Arial bold", txtInfo_color);
		txtInfo[i].x = tempX - 20;
		txtInfo[i].y = tempY + 40;
		txtInfo[i].name = bitmap.name;
		//txtInfo[i].visible = false;
		//bitmap.addChild(txt[i]);
		container.addChild(txt[i]);
		container.addChild(txtInfo[i]);



		if(i==0){
			var point = [tempX,tempY,i,10];
		}else if(i < 5){
			var point = [tempX,tempY,i,0];
		}else{
			var point = [tempX,tempY,i,4];
		}
		
		points.push(point);
		//line
		for(var n = 0;n < points.length - 1; n ++){
			
				if (points[i][3] == points[n][2]){
					lines[line_no] = new createjs.Shape();
					lines[line_no].graphics.setStrokeStyle(1,"round").beginStroke(line_color).moveTo(points[n][0], points[n][1]).lineTo(points[i][0], points[i][1]);
					container.addChild(lines[line_no]);
					lines[line_no].compositeOperation = "destination-over";
					var t = [points[n][0], points[n][1],points[i][0], points[i][1],n,i,line_no];
					line_tag.push(t);
					line_no ++;
				}
			
		}
		

		

		// wrapper function to provide scope for the event handlers:
		(function(target) {
			bitmap.onPress = function(evt) {
				//container.addChild(target);
				
				moveflag = false;
				if(!moveflag){
					var ts = new Date();
					timeStart = ts.getSeconds();
					console.log("press" + timeStart);
					setTimeout(function(){
							console.log("3" + timeStart);
							var te = new Date();
							timeEnd = te.getSeconds();
							console.log("end" + timeEnd);
							//console.log("end - start" + time);
							if((timeEnd - timeStart) >= 1){
								var i = parseInt(target.name);
								target.visible = false;	
								txt[i].visible = false;
								txtInfo[i].visible = false;
								for(var l = 0;l < line_tag.length;l ++){
									if(line_tag[l][4] == i || line_tag[l][5] == i){
										lines[line_tag[l][6]].visible = false;
										
									}
								}
								
								update = true;
								showTd(i);
							}
						},1000);
				}
				var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};

				evt.onMouseMove = function(ev) {
					
					target.x = ev.stageX+offset.x;
					target.y = ev.stageY+offset.y;
					var i = parseInt(target.name);
					if(target.x < 200){
						for(var l = 0;l < line_tag.length;l ++){
							if(line_tag[l][4] == i || line_tag[l][5] == i){
								lines[line_tag[l][6]].visible = false;
								
							}
						}
						txtInfo[i].visible = false;
						txtInfo[i].visible = false;
					}
					txt[i].x = target.x - 10;
					txt[i].y = target.y + 10;
					txtInfo[i].x = target.x -20;
					txtInfo[i].y = target.y + 40;
					
					
					
					for(var l = 0;l < line_tag.length;l ++){
						if(line_tag[l][4] == i){//移动起点
							lines[line_tag[l][6]].graphics.clear().setStrokeStyle(1,"round").beginStroke(line_color).moveTo(txt[i].x,txt[i].y).lineTo(line_tag[l][2],line_tag[l][3]).endStroke ( );
							//lines[line_tag[l][6]].compositeOperation = "destination-over";
							line_tag[l][0] = txt[i].x;
							line_tag[l][1] = txt[i].y;
						}else if(line_tag[l][5] == i){
							lines[line_tag[l][6]].graphics.clear().setStrokeStyle(1,"round").beginStroke(line_color).moveTo(line_tag[l][0],line_tag[l][1]).lineTo(txt[i].x,txt[i].y).endStroke ( );
							//lines[line_tag[l][6]].compositeOperation = "destination-over";
							line_tag[l][2] = txt[i].x;
							line_tag[l][3] = txt[i].y;
						}
					}
					
					
					update = true;
					moveflag = true;
					var ts1 = new Date();
					timeStart = ts1.getSeconds() + 10;
				}
				//container.addChild(target);
			}
			bitmap.onMouseOver = function() {
				target.scaleX = target.scaleY = target.scale*1.2;
				//var i = parseInt(target.name);
				//txtInfo[i].visible = true;
				//txt1 = new createjs.Text("humid:100\ntemprature:28","16px Arial bold", "#000");
				//txt1.x = target.x -20;
				//txt1.y = target.y + 40;
				//container.addChild(txt1);
				
				update = true;
			}
			bitmap.onMouseOut = function() {
				target.scaleX = target.scaleY = target.scale;
				update = true;
			}
			
			bitmap.onClick = function(){
				
				if(!moveflag){
					var i = parseInt(target.name);
					if(txtInfo[i].isVisible()){
						txtInfo[i].visible = false;
					}else{
						txtInfo[i].visible = true;
					}
					//setTimeOut(function(){txtInfo[i].visible = false},2000);
					update = true;
					var ts2 = new Date();
					timeStart = ts2.getSeconds() + 10;
					console.log("10" + timeStart);
					
				}
				
				
				
			}
		})(bitmap);
	}
	imap = new createjs.Bitmap(map);
	container.addChild(imap);
	imap.x = 200;
	imap.y = 0;
	imap.compositeOperation = "destination-over";

	document.getElementById("loader").className = "";
	createjs.Ticker.addListener(window);
}

function tick() {
	// this set makes it so the stage only re-renders when an event handler indicates a change has happened.
	if (update) {
		update = false; // only update once
		stage.update();
	}
}

var beishu = 1;

function fangda(){
	beishu += 0.1;
	
	update = true;
	imap.scaleX = imap.scaleY = beishu;
		
	
	txt[5].x = x1 * beishu;
	txt[5].y = y1 * beishu;
	
}
function suoxiao(){
	beishu -= 0.1;
	imap.scaleX = imap.scaleY = beishu;
	update = true;
}
