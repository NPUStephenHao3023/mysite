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
//		alert('hello world ');
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
			legendHoverLink: true,
			hoverAnimation: true,
			selectedMode: 'multiple',
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
	window.addEventListener('resize', function () {
		myChart.resize();
	});
}

//绘制饼状图
function chart1() {
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
			data: ['公司企业', '商务住宅', '政府机构', '餐饮服务', '生活服务', '交通设施服务', '购物服务', '汽车服务']
		},

		calculable: false,
		series: [{
			name: '地点类型',
			type: 'pie',
			radius: '70%',
			center: ['50%', '50%'],
			legendHoverLink: true,
			hoverAnimation: true,
			selectedMode: 'multiple',
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
			data: [{
					value: 1,
					name: '公司企业'
				}, {
					value: 14,
					name: '商务住宅'
				}, {
					value: 8,
					name: '政府机构'
				}, {
					value: 8,
					name: '餐饮服务'
				}, {
					value: 47,
					name: '生活服务'
				}, {
					value: 2,
					name: '交通设施服务'
				}, {
					value: 2,
					name: '购物服务'
				}, {
					value: 18,
					name: '汽车服务'
				},

			]
		}]
	};

	myChart.setOption(option);
	window.addEventListener('resize', function () {
		myChart.resize();
	});
}
