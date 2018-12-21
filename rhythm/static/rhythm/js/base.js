/**
 * Created by 30947 on 2018/7/20.
 */
//var myChart = echarts.init(document.getElementById("chart1"));
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

	$(".nav>ul>li").hover(function () {
		$(this).find(".li_ul").stop(true, true).slideDown("slow");
		stop();
	}, function () {
		$(this).find(".li_ul").slideUp("slow");
	})
}
function hiddenall(){
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
function onchangeradio(id,method){
	hiddenall();
	if(method==1){
		$("#method1").removeClass("hide");
	}else if(method==2){
		$("#method2").removeClass("hide");
	}else if(method==3){
		$("#method3").removeClass("hide");
	}else if(method==4){
		$("#method4").removeClass("hide");
	}else if(method==5){
		$("#method5").removeClass("hide");
	}else if(method==6){
		$("#method6_1").removeClass("hide");
		$("#method6_2").removeClass("hide");
	}else if(method==7){
		$("#method7_1").removeClass("hide");
		$("#method7_2").removeClass("hide");
	}
}
function sumbit_data() {
	$.ajax({
		//几个参数需要注意一下
		type: "POST", //方法类型
		dataType: "json", //预期服务器返回的数据类型
		url: "demo_test.txt", //url
		data: $('#form1').serialize(),
		success: function (result) {
			handle(result);
		},
		error: function () {
			alert("异常！");
		}
	});
}

function handle(result) {
	console.log(result); //打印服务端返回的数据(调试用)
	alert(result.employee[0].firstName);
	var isAutoSend = document.getElementsByName("method");
	for (var i = 0; i < isAutoSend.length; i++) {
		if (isAutoSend[i].checked == true) {
			if(i==0){
				make_chart1();
			}else if(i==1){
				make_chart2();
			}else if(i==6){
				make_chart6();
			}
		}
	}

//	alert(result.employee[0].firstName);
	if (result.resultCode == 200) {
		alert("SUCCESS");
	};
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
