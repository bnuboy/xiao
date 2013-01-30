function Time(startTime,endTime){
	this.startTime = new Date(startTime);
	this.endTime   = endTime;
}
Time.prototype.timeDiff = function(){
	var startTime = this.startTime.getTime();
	var endTime = this.endTime.getTime();
	return (endTime - startTime)/1000;
}