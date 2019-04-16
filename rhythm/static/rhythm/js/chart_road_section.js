/**
 * Created by 30947 on 2018/7/18.
 */
$(function () {
	//	chart1();

})
var method_choice;
var submitted = false;

function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function csrfSafeMethod(method) {
	// these HTTP methods do not require CSRF protection
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function submit_data_lines() {
	var csrftoken = getCookie('csrftoken');
	//包装数据
	var formData = {
		'method': $('input[name=method]:checked').val(),
		'method1': $('input[name=method1]').val(),
		'method2': $('input[name=method2]').val(),
		'method3': $('input[name=method3]').val(),
		'method4': $('input[name=method4]').val(),
		'method5': $('input[name=method5]').val(),
		'method6_1': $('input[name=method6_1]').val(),
		'method6_2': $('input[name=method6_2]').val(),
		'method7_1': $('input[name=method7_1]').val(),
		'method7_2': $('input[name=method7_2]').val(),
		'method8_1': $('input[name=method8_1]').val(),
		'method8_2': $("#method8_2  option:selected").val(),
		'method9': $('input[name=method9]').val(),
		'method10': $("#method10  option:selected").val(),
		'method11': $("#method11  option:selected").val(),
		'dataset': $('input[name=dataset]:checked').val()
	};
	console.log(formData);
	//如果正在加载则不能重复提交
	if (submitted == true) {
		alert("正在加载请耐心等待！");
		return;
	}

	console.log(formData);
	//发送后submited=true，并更换加载图片，表示正在加载。
	submitted = true;
	method_choice = formData["method"];
	//	$('#final_image').attr('src', '/static/rhythm/img/loading.gif');

	//发送请求
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
	$.ajax({
		//几个参数需要注意一下
		type: "POST", //方法类型
		dataType: "json", //预期服务器返回的数据类型
		//		url: "select/", //url
		//		url:"/static/rhythm/demo_test.txt",
		url: "/static/rhythm/data_for_test/lines-bus.json",
		data: formData,
		success: function (data) {
			//有返回值
			submitted = false;
			makeChart_roadsection(data);
		},
		error: function () {
			alert("异常！");
			submitted = false;
		}
	});

	function handle(result) {

		console.log(result);
		//		alert('hello world ');
	}
}

function makeChart_roadsection(data) {
	var myChart = echarts.init(document.getElementById("chart_lines_1"));
	var app = {};
	var option = null;
	app.title = '北京公交路线 - 百度地图';

	console.log(data);
	//	data=$.parseJSON(data);
	var busLines = [].concat.apply([], data.map(function (busLine, idx) {
		var prevPt;
		var points = [];
		for (var i = 0; i < busLine.length; i += 2) {
			var pt = [busLine[i], busLine[i + 1]];
			if (i > 0) {
				pt = [
					prevPt[0] + pt[0],
					prevPt[1] + pt[1]
				];
			}
			prevPt = pt;

			points.push([pt[0] / 1e4, pt[1] / 1e4]);
		}
		//        return {
		//            coords: points
		//        };
		return [points];
	}));
	var len = busLines.length;
	console.log(busLines);
	var option = {
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: '{a} {b}'
		},
		bmap: {
			center: [116.46, 39.92],
			zoom: 10,
			roam: true,
			mapStyle: {
				styleJson: [{
					'featureType': 'water',
					'elementType': 'all',
					'stylers': {
						'color': '#d1d1d1'
					}
				}, {
					'featureType': 'land',
					'elementType': 'all',
					'stylers': {
						'color': '#f3f3f3'
					}
				}, {
					'featureType': 'railway',
					'elementType': 'all',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'highway',
					'elementType': 'all',
					'stylers': {
						'color': '#fdfdfd'
					}
				}, {
					'featureType': 'highway',
					'elementType': 'labels',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'arterial',
					'elementType': 'geometry',
					'stylers': {
						'color': '#fefefe'
					}
				}, {
					'featureType': 'arterial',
					'elementType': 'geometry.fill',
					'stylers': {
						'color': '#fefefe'
					}
				}, {
					'featureType': 'poi',
					'elementType': 'all',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'green',
					'elementType': 'all',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'subway',
					'elementType': 'all',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'manmade',
					'elementType': 'all',
					'stylers': {
						'color': '#d1d1d1'
					}
				}, {
					'featureType': 'local',
					'elementType': 'all',
					'stylers': {
						'color': '#d1d1d1'
					}
				}, {
					'featureType': 'arterial',
					'elementType': 'labels',
					'stylers': {
						'visibility': 'off'
					}
				}, {
					'featureType': 'boundary',
					'elementType': 'all',
					'stylers': {
						'color': '#fefefe'
					}
				}, {
					'featureType': 'building',
					'elementType': 'all',
					'stylers': {
						'color': '#d1d1d1'
					}
				}, {
					'featureType': 'label',
					'elementType': 'labels.text.fill',
					'stylers': {
						'color': '#999999'
					}
				}]
			}
		},
		series: [{
			type: 'lines',
			coordinateSystem: 'bmap',
			polyline: true, //表示曲线
			//			data:busLines,
			data: (function () {
				var t = [];
				for (var i = 0; i < len; i++) {
					var tmp = {
						name: "No: " + (i + 1),
						coords: busLines[i],
						number: i,
						lineStyle: {
							color: (function () {
								var colorList = ['#EE1289', '#DC143C', '	#E066FF', '#FF1493', '#FF6347', '#FF0000', '#B23AEE', '#BA55D3', '#C71585', '#9B30FF', '#969696', '#8E388E', '#8B008B', '#7D9EC0', '#7A7A7A', '#7A67EE', '#696969', '#515151', '#404040', '#12121', '#191970', '#00CD66', '#0000EE', '#00CDCD', '#7D26CD', '#71C671', '#76EE00', '#87CEFA', '#698B22', '#7171C6', '#ADADAD', '#DEB887'];
								return colorList[Math.floor(Math.random() * colorList.length)];
							})(),
							opacity: 0.5,
							width: 1,
							curveness: 0.5
						}
					}
					t.push(tmp);
				}
				return t;
			})(),
			silent: false, //
			effect: {
				show: true,
				symbol: 'circle',
				symbolSize: 4,

			},
			symbol: 'circle',
			progressiveThreshold: 500,
			progressive: 200,
			animation: false
		}]
	};
	console.log(option.series[0].data);
	myChart.setOption(option);

	myChart.off('click');
	myChart.on('click', function (param) {
		console.log(param);
		submit_data_roadsection_2(param.data.name);

	});


	//	myChart.on('click', function (param) {
	//		console.log(param);
	//		//		alert(param.name+" "+param.value);
	//		//		makeChart_pie02(param.name, param.value);
	//	});
	window.addEventListener('resize', function () {
		myChart.resize();
	});
}

//针对路段生成poi分布图，name：路段的名字。
function submit_data_roadsection_2(name) {
//	alert(name);
	var csrftoken = getCookie('csrftoken');
	//包装数据
	var formData = {
		'method': $('input[name=method]:checked').val(),
		'method1': $('input[name=method1]').val(),
		'method2': $('input[name=method2]').val(),
		'method3': $('input[name=method3]').val(),
		'method4': $('input[name=method4]').val(),
		'method5': $('input[name=method5]').val(),
		'method6_1': $('input[name=method6_1]').val(),
		'method6_2': $('input[name=method6_2]').val(),
		'method7_1': $('input[name=method7_1]').val(),
		'method7_2': $('input[name=method7_2]').val(),
		'method8_1': $('input[name=method8_1]').val(),
		'method8_2': $("#method8_2  option:selected").val(),
		'method9': $('input[name=method9]').val(),
		'method10': $("#method10  option:selected").val(),
		'dataset': $('input[name=dataset]:checked').val()
	};
	console.log(formData);
	//如果正在加载则不能重复提交
	if (submitted == true) {
		alert("正在加载请耐心等待！");
		return;
	}

	console.log(formData);
	//发送后submited=true，并更换加载图片，表示正在加载。
	submitted = true;
	method_choice = formData["method"];
	//	$('#final_image').attr('src', '/static/rhythm/img/loading.gif');

	//发送请求
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
	$.ajax({
		//几个参数需要注意一下
		type: "POST", //方法类型
		dataType: "json", //预期服务器返回的数据类型
		//		url: "select/", //url
		//		url:"/static/rhythm/demo_test.txt",
		url: "/static/rhythm/data_for_test/poi.json",
		data: formData,
		success: function (data) {
			//有返回值
			submitted = false;
			makeChart_lines(data);
		},
		error: function () {
			alert("异常！");
			submitted = false;
		}
	});
}

function makeChart_lines(data) {
	var myChart = echarts.init($("#chart_lines_2")[0]);
	var len = data.length;
	var option = {
		backgroundColor: "#fff",
		title: {
			text: '成都市POI热度统计',
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params, ticket, callback) {
				console.log(params[0]);
				var poi = params[0].data.poi;
				var value = params[0].value;
				var name = params[0].name;
				return value + "<br/> POI:" + poi;
			}
		},
		xAxis: {
			data: data.map(function (item) {
				return item[2];
			})
		},
		yAxis: {
			splitLine: {
				show: false
			}
		},
		dataZoom: [{
			startValue: 1
		}, {
			type: 'inside'
		}],
		visualMap: {
			type: "piecewise",
			top: 10,
			right: 10,
			pieces: [{
				gt: 0,
				lte: 0.2,
				label: "0 - 0.2",
				color: '#096'
			}, {
				gt: 0.2,
				lte: 0.4,
				label: "0.2 - 0.4",
				color: '#ffde33'
			}, {
				gt: 0.4,
				lte: 0.6,
				label: "0.4 - 0.6",
				color: '#ff9933'
			}, {
				gt: 0.6,
				lte: 0.8,
				label: "0.6 - 0.8",
				color: '#cc0033'
			}, {
				gt: 0.8,
				lte: 1.0,
				label: "0.8 - 1.0",
				color: '#660099'
			}, {
				gt: 1.0,
				label: "> 1.0",
				color: '#7e0023'
			}],
			outOfRange: {
				color: '#999'
			}
		},
		series: {
			name: 'Beijing AQI',
			type: 'line',
			data: (function () {
				var t = [];
				for (var i = 0; i < len; i++) {
					var tmp = {
						value: data[i][1],
						name: data[i][2],
						poi: data[i][0]
					};
					t.push(tmp);
				}
				return t;
			})(),
			//            data: data.map(function (item) {
			//                return item[1];
			//            }),
			markLine: {
				silent: true,
				data: [{
					yAxis: 0.2
				}, {
					yAxis: 0.4
				}, {
					yAxis: 0.6
				}, {
					yAxis: 0.8
				}, {
					yAxis: 1.0
				}]
			}
		}
	}
	myChart.setOption(option);
	myChart.on('click', function (param) {
		console.log(param);
		//		alert(param.name+" "+param.value);
		//		makeChart_pie02(param.name, param.value);
	});
	window.addEventListener('resize', function () {
		myChart.resize();
	});
}
