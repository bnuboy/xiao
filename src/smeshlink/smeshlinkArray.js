Array.prototype.unique = function(){
	var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (!n[this[i]]) //如果hash表中没有当前项
		{
			n[this[i]] = true; //存入hash表
			r.push(this[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
};
Array.prototype.inArray = function (value)   
//Returns true if the passed value is found in the    
//array.  Returns false if it is not.    
{   
var i;   
for (i=0; i < this.length; i++){  
    // Matches identical (===), not just similar (==).    
    if (this[i] === value){  
        return true;   
    }  
}  
return false;  
}; 