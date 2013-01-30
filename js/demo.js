Event.observe(document, 'dom:loaded', function() {
	

    
    prettyPrint();///好像不要也可以
    
    HumbleFinance.trackFormatter = function (obj) {//当鼠标浮动上去触发此事件
  
        var x = Math.floor(obj.x);
        var data = jsonData[x];
        var text = data.date + " Price: " + data.close + " Vol: " + data.volume;
        
        return text;
    };
    HumbleFinance.trackFormatter1 = function (obj) {//当鼠标浮动上去触发此事件
    	  
        var x = Math.floor(obj.x);
        var data = jsonData[x];
        var text = data.date + " Price: " + allData[1][x];
        
        return text;
    };
    
    HumbleFinance.yTickFormatter = function (n) {//绘制y轴坐标
        if (n == this.axes.y.max) {
            return false;
        }
        
        return '$'+n;
    };
    
    HumbleFinance.xTickFormatter = function (n) { //绘制x轴坐标
        
        if (n == 0) {
            return false;
        }
        
        var date = jsonData[n].date;
        date = date.split(' ');
        date = date[2];
        
        return date; 
    }
    
    HumbleFinance.init('finance', priceData, volumeData, summaryData, humidData);
    HumbleFinance.setFlags(flagData); 
    
    var xaxis = HumbleFinance.graphs.summary.axes.x;
    var prevSelection = HumbleFinance.graphs.summary.prevSelection;
    var xmin = xaxis.p2d(prevSelection.first.x);
    var xmax = xaxis.p2d(prevSelection.second.x);
    
    $('dateRange').update(jsonData[xmin].date + ' - ' + jsonData[xmax].date);
    
    Event.observe(HumbleFinance.containers.summary, 'flotr:select', function (e) {
        var area = e.memo[0];
        xmin = Math.floor(area.x1);
        xmax = Math.ceil(area.x2);
        
        var date1 = jsonData[xmin].date;
        var date2 = jsonData[xmax].date;
        
        $('dateRange').update(jsonData[xmin].date + ' - ' + jsonData[xmax].date);
    });
});