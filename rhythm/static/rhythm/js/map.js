
$(function(){

    initMap();


})



//加载地图
function initMap(){
// 百度地图API功能
    var map = new BMap.Map("map_div");    // 创建Map实例
    var count =50;
    var point = new BMap.Point(104.056859, 30.636988);
    map.centerAndZoom(point, 12);             // 初始化地图
    map.enableScrollWheelZoom(); // 允许滚轮缩放
	var points =[
    {"lng":104.076859,"lat":30.626988,"count":count},
    {"lng":104.08188,"lat":30.62645,"count":count},
    {"lng":104.03503,"lat":30.58781,"count":count},
    {"lng":104.047415,"lat":30.626102,"count":count},
    {"lng":104.058136,"lat":30.651567,"count":count},
    {"lng":104.06073,"lat":30.64627,"count":count},
    {"lng":104.06073,"lat":30.64627,"count":count},
    {"lng":104.06073,"lat":30.652062,"count":count},
    {"lng":104.072742,"lat":30.670101,"count":count},
    {"lng":104.078301,"lat":30.645974,"count":count},
    {"lng":104.068875,"lat":30.720661,"count":count},
    {"lng":104.080686,"lat":30.651314,"count":count},
    {"lng":104.080686,"lat":30.651314,"count":count},
    {"lng":104.033422,"lat":30.650673,"count":count},
    {"lng":104.054412,"lat":30.627381,"count":count},
    {"lng":104.025541,"lat":30.643765,"count":count},
    {"lng":104.01737,"lat":30.673363,"count":count},
    {"lng":104.023651,"lat":30.645394,"count":count},
    {"lng":104.069848,"lat":30.664127,"count":count},
    {"lng":103.984704,"lat":30.669462,"count":count},
    {"lng":104.073213,"lat":30.602044,"count":count},
    {"lng":104.040573,"lat":30.705539,"count":count},
    {"lng":104.032878,"lat":30.65361,"count":count},
    {"lng":104.065583,"lat":30.627,"count":count},
    {"lng":104.048517,"lat":30.681731,"count":count},
    {"lng":104.085511,"lat":30.682777,"count":count},
    {"lng":104.037994,"lat":30.643292,"count":count},
    {"lng":104.06743,"lat":30.695716,"count":count},
    {"lng":104.045472,"lat":30.62479,"count":count},
    {"lng":104.070018,"lat":30.679993,"count":count},
    {"lng":104.029906,"lat":30.685877,"count":count},
    {"lng":104.039633,"lat":30.655387,"count":count},
    {"lng":104.03845,"lat":30.646482,"count":count},
    {"lng":104.053716,"lat":30.636352,"count":count},
    {"lng":104.035217,"lat":30.634888,"count":count},
    {"lng":104.102827,"lat":30.606937,"count":count},
    {"lng":104.098579,"lat":30.614636,"count":count},
    {"lng":103.982514,"lat":30.647503,"count":count},
    {"lng":104.125442,"lat":30.740703,"count":count},
    {"lng":104.058811,"lat":30.627863,"count":count},
    {"lng":104.077467,"lat":30.618422,"count":count},
    {"lng":103.978138,"lat":30.644339,"count":count},
    {"lng":104.021026,"lat":30.673051,"count":count},
    {"lng":104.037554,"lat":30.667897,"count":count},
    {"lng":104.048584,"lat":30.674225,"count":count},
    {"lng":104.02202,"lat":30.665323,"count":count},
    {"lng":104.088817,"lat":30.680169,"count":count},
    {"lng":104.037511,"lat":30.691338,"count":count},
    {"lng":104.112569,"lat":30.620175,"count":count},
    {"lng":104.022708,"lat":30.64624,"count":count},
    {"lng":104.076732,"lat":30.67586,"count":count},
    {"lng":104.094344,"lat":30.599937,"count":count},
    {"lng":104.065144,"lat":30.627233,"count":count},
    {"lng":104.05463,"lat":30.631923,"count":count},
    {"lng":104.01667,"lat":30.67133,"count":count},
    {"lng":104.097246,"lat":30.619319,"count":count},
    {"lng":104.038507,"lat":30.706814,"count":count},
    {"lng":104.079982,"lat":30.621678,"count":count},
    {"lng":104.057428,"lat":30.691499,"count":count},
    {"lng":104.071403,"lat":30.676689,"count":count},
    {"lng":104.059967,"lat":30.623269,"count":count},
    {"lng":104.042206,"lat":30.630622,"count":count},
    {"lng":104.024419,"lat":30.700753,"count":count},
    {"lng":104.072254,"lat":30.65826,"count":count},
    {"lng":104.057014,"lat":30.641563,"count":count},
    {"lng":104.063954,"lat":30.624808,"count":count},
    {"lng":104.030693,"lat":30.67254,"count":count},
    {"lng":104.046714,"lat":30.694694,"count":count},
    {"lng":104.120247,"lat":30.618755,"count":count},
    {"lng":104.05975,"lat":30.680883,"count":count},
    {"lng":104.020802,"lat":30.644695,"count":count},
    {"lng":104.106033,"lat":30.644751,"count":count},
    {"lng":103.968256,"lat":30.615174,"count":count},
    {"lng":104.065809,"lat":30.62072,"count":count},
    {"lng":104.082863,"lat":30.665397,"count":count},
    {"lng":104.067476,"lat":30.626375,"count":count},
    {"lng":104.056003,"lat":30.680131,"count":count},
    {"lng":104.065809,"lat":30.62072,"count":count},
    {"lng":104.053648,"lat":30.654907,"count":count},
    {"lng":104.065809,"lat":30.62072,"count":count},
    {"lng":104.032829,"lat":30.653647,"count":count},
    {"lng":104.024558,"lat":30.646699,"count":count},
    {"lng":104.068162,"lat":30.652872,"count":count},
    {"lng":104.066534,"lat":30.691081,"count":count},
    {"lng":104.026778,"lat":30.662654,"count":count},
    {"lng":104.08351,"lat":30.625453,"count":count},
    {"lng":104.04693,"lat":30.640248,"count":count},
    {"lng":104.077188,"lat":30.622274,"count":count},
    {"lng":104.055264,"lat":30.622839,"count":count},
    {"lng":104.071486,"lat":30.628645,"count":count},
    {"lng":104.018498,"lat":30.648213,"count":count},
    {"lng":104.071215,"lat":30.659096,"count":count},
    {"lng":104.098996,"lat":30.630425,"count":count},
    {"lng":103.999894,"lat":30.706614,"count":count},
    {"lng":104.098727,"lat":30.62457,"count":count},
    {"lng":104.032052,"lat":30.694235,"count":count},
    {"lng":104.070462,"lat":30.676057,"count":count},
    {"lng":104.086826,"lat":30.658691,"count":count},
    {"lng":104.09233,"lat":104.09233,"count":count}];
	
    if(!isSupportCanvas()){
    	alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
    }
	//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
	//参数说明如下:
	/* visible 热力图是否显示,默认为true
     * opacity 热力的透明度,1-100
     * radius 势力图的每个点的半径大小   
     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
     *	{
			.2:'rgb(0, 255, 255)',
			.5:'rgb(0, 110, 255)',
			.8:'rgb(100, 0, 255)'
		}
		其中 key 表示插值的位置, 0~1. 
		    value 为颜色值. 
     */
	var mapStyle={
        style:"midnight"
    };
    map.setMapStyle(mapStyle);
	heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
	map.addOverlay(heatmapOverlay);
	heatmapOverlay.setDataSet({data:points,max:100});
	heatmapOverlay.show();
	
}
 function setGradient(){
     	/*格式如下所示:
		{
	  		0:'rgb(102, 255, 0)',
	 	 	.5:'rgb(255, 170, 0)',
		  	1:'rgb(255, 0, 0)'
		}*/
     	var gradient = {};
     	var colors = document.querySelectorAll("input[type='color']");
     	colors = [].slice.call(colors,0);
     	colors.forEach(function(ele){
			gradient[ele.getAttribute("data-key")] = ele.value; 
     	});
        heatmapOverlay.setOptions({"gradient":gradient});
    }
	//判断浏览区是否支持canvas
    function isSupportCanvas(){
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }
