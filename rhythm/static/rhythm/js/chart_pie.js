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

function sumbit_data_pie() {
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
		url: "/static/rhythm/dataset_pie.txt",
		data: formData,
		success: function (result) {
			//有返回值
			submitted = false;
			handle(result);
		},
		error: function () {
			alert("异常！");
			submitted = false;
		}
	});

	function handle(result) {
		makeChart_pie(result);
		console.log(result);
	}
}

function makeChart_pie(result) {
	var len = result["charts"]["length"];
	var Name = result["charts"]["name"];
	var val = result["charts"]["value"];
	var myChart = echarts.init($("#chart_1")[0]);

	option = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c}% "
		},
		legend: {
			orient: 'vertical',
			x: 'right',
			textStyle: {
				color: '#ffffff',

			},
			data: Name
		},

		calculable: false,
		series: [{
			name: '地点类型',
			type: 'pie',
			radius: '70%',
			center: ['50%', '50%'],
			minAngle: 3,
			avoidLabelOverlap: false,
			selectedMode: false,
			itemStyle: {
				normal: {
					label: {
						show: true,
						textStyle: {
							fontSize: '15'
						},
						formatter: "{b} : {c}%"
					},
					labelLine: {
						show: false
					}
				},
				emphasis: {
					label: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				}
			},
			data: (function () {
				var t = [];
				for (var i = 0; i < len; i++) {
					var tmp = {
						value: val[i],
						name: Name[i]
					};
					t.push(tmp);

				}
				return t;
			})()
		}]
	};

	myChart.setOption(option);
	myChart.on('click', function (param) {
		console.log(param);
		//		alert(param.name+" "+param.value);
		makeChart_pie02(param.name, param.value);
	});
	window.addEventListener('resize', function () {
		myChart.resize();
	});
}

function makeChart_pie02(name, value) {
	//	var len = result["charts"]["length"];
	//	var Name = result["charts"]["name"];
	//	var val = result["charts"]["value"];
	var len = 1
	$('#chart_2').width($('#chart_2').width());
	$('#chart_2').height($('#chart_2').height());
	var myChart2 = echarts.init(document.getElementById("chart_2"));

	option = {
		title: {
			text: '"'+name+'"POI细分热度统计',
			x: 'center', // 水平安放位置，默认为左对齐，可选为：
			y: 'top', // 垂直安放位置，默认为全图顶端，可选为：
			//textAlign: null          // 水平对齐方式，默认根据x设置自动调整
			backgroundColor: 'rgba(0,0,0,0)',
			borderColor: '#ccc', // 标题边框颜色
			borderWidth: 0, // 标题边框线宽，单位px，默认为0（无边框）
			padding: 5, // 标题内边距，单位px，默认各方向内边距为5，
			// 接受数组分别设定上右下左边距，同css
			itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，
			textStyle: {
				fontSize: 18,
				fontWeight: 'bolder',
				color: '#fff' // 主标题文字颜色
			},
			subtextStyle: {
				color: '#aaa' // 副标题文字颜色
			}
		},
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c}% "
		},
		legend: {
			orient: 'vertical',
			x: 'right',
			textStyle: {
				color: '#ffffff',

			},
			data: [name]
		},

		calculable: false,
		series: [{
			name: '地点类型',
			type: 'pie',
			radius: '70%',
			center: ['50%', '50%'],
			minAngle: 3,
			avoidLabelOverlap: false,
			itemStyle: {
				normal: {
					label: {
						show: true,
						textStyle: {
							fontSize: '15'
						},
						formatter: "{b} : {c}%"
					},
					labelLine: {
						show: false
					}
				},
				emphasis: {
					label: {
						show: true,
						position: 'center',
						textStyle: {
							fontSize: '20',
							fontWeight: 'bold'
						}
					}
				}
			},
			data: (function () {
				var t = [];
				for (var i = 0; i < len; i++) {
					var tmp = {
						value: value,
						name: name
					};
					t.push(tmp);

				}
				return t;
			})()
		}]
	};

	myChart2.setOption(option);
	window.addEventListener('resize', function () {
		myChart2.resize();
	});
}
