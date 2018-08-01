var Promise = require('bluebird');


var universalFunctions = (function () {

	this.startDate = function () {
		var d = new Date();
		var month = d.getMonth() + 1;
		return d.getFullYear() + "-" + month + "-" + d.getDate();
	}
	this.endDate = function () {
		var d = new Date();
		var month = d.getMonth() + 1;
		var nextDay = d.getDate() + 1;
		return d.getFullYear() + "-" + month + "-" + nextDay;
	}
	this.currentMonth = function () {
		var d = new Date();
		var month = d.getMonth() + 1;
		return d.getFullYear() + "-" + month + "-" + 1;
	}
	this.endDayOfCurrentMonth= function(){
		var d = new Date();
		var month = d.getMonth() + 1;
		return d.getFullYear() + "-" + month + "-" + 31;
	}

	this.getDate=function(day){
		var d = new Date(new Date().setDate(new Date().getDate()+day));
		// var d= new Date();
		var month = d.getMonth() + 1;
		// var day = d.getDate() + day;
		var day= d.getDate();
		return d.getFullYear() + "-" + month + "-" + day;
	}
	
	this.lastMonth= function(){
		var d = new Date();
		var month = d.getMonth();
		return d.getFullYear() + "-" + month + "-" + 1;
		
	}
return this ;
}());



module.exports=universalFunctions;
	