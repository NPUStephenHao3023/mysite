/**
 * Created by 30947 on 2018/7/20.
 */
//var myChart = echarts.init(document.getElementById("chart1"));
var submitted=false;//submitted变量用于保证加载过程中不能重复提交
$(function () {
	nav();
	$("#submit_data").click(function () {
		myChart.clear();
		make_chart1();
	});
	$("#submit_data1").click(function () {
		myChart.clear();
		make_chart2();
	});
	$("#submit_data5").click(function () {
		myChart.clear();
		make_chart6();
	});
})
//导航条点击添加样式
function nav() {
	initdata();
	$(".nav>ul>li").hover(function () {
		$(this).find(".li_ul").stop(true, true).slideDown("slow");
		stop();
	}, function () {
		$(this).find(".li_ul").slideUp("slow");
	})
}
//将数据初始化成默认值
function initdata(){
	$('#information_entropy').text('. . .');
	$('#varience').text('. . .');
	$('#standard_deviation').text('. . .');
	$('#mean').text('. . .');
	$('#max').text('. . .');
	$('#min').text('. . .');
	$('#skew').text('. . .');
	$('#kurtosis').text('. . .');	
	$('#len').text('. . .');
}
function hiddenall() {
	$("#method1").addClass("hide");
	$("#method2").addClass("hide");
	$("#method3").addClass("hide");
	$("#method4").addClass("hide");
	$("#method5").addClass("hide");
	$("#method6_1").addClass("hide");
	$("#method6_2").addClass("hide");
	$("#method7_1").addClass("hide");
	$("#method7_2").addClass("hide");
}
// function change_checked_state(id) {
// 	var $radios =  $('input:radio[name=method]');
// 	$radios.filter('[value=method1]').prop('checked', false);
// 	$id.prop('checked', true);
// }
function onchangeradio(id, method) {
	hiddenall();
	// change_checked_state(id);
	if (method == 1) {
		$("#method1").removeClass("hide");
	} else if (method == 2) {
		$("#method2").removeClass("hide");
	} else if (method == 3) {
		$("#method3").removeClass("hide");
	} else if (method == 4) {
		$("#method4").removeClass("hide");
	} else if (method == 5) {
		$("#method5").removeClass("hide");
	} else if (method == 6) {
		$("#method6_1").removeClass("hide");
		$("#method6_2").removeClass("hide");
	} else if (method == 7) {
		$("#method7_1").removeClass("hide");
		$("#method7_2").removeClass("hide");
	}
}
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
function sumbit_data() {
	var csrftoken = getCookie('csrftoken');
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
		'dataset': $('input[name=dataset]:checked').val()
	};
	//如果正在加载则不能重复提交
	if(submitted==true){
		alert("正在加载请耐心等待！");
		return;
	}
	//判断是否选择了方法和数据集
	var flags= true;
	if(formData["method"]==undefined && formData["dataset"]==undefined){
		alert("请选择方法和数据集！");
		flags=false;
	}else if(formData["method"]==undefined){
		alert("请选择想要运行的方法!");
		flags=false;
	}else if(formData["dataset"]==undefined){
		alert("请选择数据集！");
		flags=false;
	}
	if(flags==false){
		return ;
	}
	
//	console.log(formData);
	//发送后submited=true，并更换加载图片，表示正在加载。
	submitted=true;
	$('#final_image').attr('src', '/static/rhythm/img/loading.gif');
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
		url: "select/", //url
		data: formData,
		success: function (result) {
			//有返回值
			submitted=false;
			handle(result);
		},
		error: function () {
			alert("异常！");
			submitted=false;
			$('#final_image').attr('src', '/static/rhythm/img/instruction.png');
		}
	});
}

function handle(result) {
	var image_full_name = result["image_full_name"];
	var extra_information = jQuery.parseJSON(result["extra_information"]);
	img_address = "/static/rhythm/img/generated/" + image_full_name
	$('#final_image').attr('src', img_address);
	$('#information_entropy').text(extra_information["information_entropy"]);
	$('#varience').text(extra_information["varience"]);
	$('#standard_deviation').text(extra_information["standard_deviation"]);
	$('#mean').text(extra_information["mean"]);
	$('#max').text(extra_information["max"]);
	$('#min').text(extra_information["min"]);
	$('#skew').text(extra_information["skew"]);
	$('#kurtosis').text(extra_information["kurtosis"]);
	$('#len').text(extra_information["len"]);
	console.log(result); //打印服务端返回的数据(调试用)
	// alert(result.employee[0].firstName);
	// var isAutoSend = document.getElementsByName("method");
	// for (var i = 0; i < isAutoSend.length; i++) {
	// 	if (isAutoSend[i].checked == true) {
	// 		if (i == 0) {
	// 			make_chart1();
	// 		} else if (i == 1) {
	// 			make_chart2();
	// 		} else if (i == 6) {
	// 			make_chart6();
	// 		}
	// 	}
	// }

	// //	alert(result.employee[0].firstName);
	// if (result.resultCode == 200) {
	// 	alert("SUCCESS");
	// };
}

function make_chart1() {
	$("#chart1").html();

	var option = {
		tooltip: {
			trigger: 'axis',
			showDelay: 0,
			axisPointer: {
				show: true,
				type: 'cross',
				lineStyle: {
					type: 'dashed',
					width: 1
				}
			}
		},
		legend: {
			textStyle: {
				fontSize: 18, //字体大小
				color: '#ffffff' //字体颜色
			},
			data: ['空间等网络划分可视化']
		},
		xAxis: [{
			axisLabel: {
				show: true,
				textStyle: {
					color: '#ffffff'
				}
			},
			type: 'value',
			scale: true,
			name: "经度",
			nameTextStyle: {
				color: "#ffffff",
				fontSize: 18
			}
		}],
		yAxis: [{
			axisLabel: {
				show: true,
				textStyle: {
					color: '#ffffff'
				}
			},
			type: 'value',
			scale: true,
			name: "纬度",
			nameTextStyle: {
				color: "#ffffff",
				fontSize: 18
			}
		}],
		series: [{
			name: '空间等网络划分可视化',
			type: 'scatter',
			large: true,
			data: (function () {
				var d = [];
				for (var i = 0; i <= 100; i++) {
					d.push([Math.random() * 100, Math.random() * 100]);
				}
				return d;
			})()
		}]
	};
	myChart.setOption(option);

}

function make_chart2() {
	option = {
		tooltip: {
			trigger: 'axis',
			showDelay: 0,
			axisPointer: {
				show: true,
				type: 'cross',
				lineStyle: {
					type: 'dashed',
					width: 1
				}
			}
		},
		legend: {
			textStyle: {
				fontSize: 18, //字体大小
				color: '#ffffff' //字体颜色
			},
			data: ['空间KDtree可视化']
		},
		xAxis: [{
			axisLabel: {
				show: true,
				textStyle: {
					color: '#ffffff'
				}
			},
			type: 'value',
			scale: true,
			name: "经度",
			nameTextStyle: {
				color: "#ffffff",
				fontSize: 18
			}
		}],
		yAxis: [{
			axisLabel: {
				show: true,
				textStyle: {
					color: '#ffffff'
				}
			},
			type: 'value',
			scale: true,
			name: "纬度",
			nameTextStyle: {
				color: "#ffffff",
				fontSize: 18
			}
		}],
		series: [{
			name: '空间KDtree可视化',
			type: 'scatter',
			large: true,
			data: (function () {
				var d = [];
				for (var i = 0; i <= 100; i++) {
					d.push([Math.random() * 100, Math.random() * 100]);
				}
				return d;
			})()
		}]
	};
	myChart.setOption(option);
}

function generateData() {
	var data = [];
	data.push([0, 0, 0.5]);
	data.push([0, 0, 0.5]);
	data.push([1, 1, 1]);
	data.push([2, 2, 2]);
	return data;
}

function make_chart6() {
	var app = {};
	option = null;
	var series = [];
	series.push({
		type: 'bar3D',
		barMaxWidth: '0.1',
		data: generateData(),
		stack: 'stack',
		shading: 'lambert',
		emphasis: {
			label: {
				show: false
			}
		}
	});
	series.push({
		type: 'bar3D',
		barMaxWidth: '0.1',
		data: generateData(),
		stack: 'stack',
		shading: 'lambert',
		emphasis: {
			label: {
				show: false
			}
		}
	});


	myChart.setOption({
		xAxis3D: {
			type: 'value'
		},
		yAxis3D: {
			type: 'value'
		},
		zAxis3D: {
			type: 'value'
		},
		grid3D: {
			viewControl: {
				// autoRotate: true
			},
			light: {
				main: {
					shadow: false,
					quality: 'ultra',
					intensity: 1.5
				}
			}
		},
		series: series
	});

}
