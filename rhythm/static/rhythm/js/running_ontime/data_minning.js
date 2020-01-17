//table_showdatatable_showdatatable_showdatatable_showdatatable_showdatatable_showdata
var submitted = false; //submitted变量用于保证加载过程中不能重复提交
var file_submitted = false; //判断是否已经提交了文件
var token = ""; //使用token将同一客户端上传文件和请求的图片相对应
var point_pairs; //保存划分区域的坐标信息。
var nrules = 0; //保存挖掘到符合条件的频繁模式的数量
var Rules; //保存挖掘到符合条件的频繁模式
//$(function () {
//	alert("freq");
//	nav();
//})
//
//function nav() {
//	hide_freq_table();
//}
//
//function hide_freq_table() {
//	$("#table_p_freq").addClass("display");
//}


//请求频繁模式挖掘
function submit_frequent_minning() {
	//	show_freq_table();
	var csrftoken = getCookie('csrftoken');
	//包装数据
	var formData = {
		'sup': $('input[name=suppport_degree_freq]').val(),
		'conf': $('input[name=confidence_level_freq]').val(),
		"token": token
	};
	//如果正在加载则不能重复提交
	if (submitted == true) {
		alert("正在加载请耐心等待！");
		return;
	}
	//判断是否选择了数据集
	if (file_submitted == false) {
		alert("请上传数据集！");
		return;
	}

	console.log(formData);
	//发送后submited=true，并更换加载图片，表示正在加载。
	submitted = true;
	$('#final_image').attr('src', '/static/rhythm/img/loading.gif');

	//发送请求
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});

	//访问服务器。
	$.ajax({
		//几个参数需要注意一下
		type: "POST", //方法类型
		dataType: "json", //预期服务器返回的数据类型
		url: "frequent_mining/", //url
		data: formData,
		success: function (result) {
			//有返回值
			console.log(result);
			//			console.log(result["is_itemset_empty"]);
			if (result["is_itemset_empty"] == false) {
				submitted = false;
				handle(result, formData);
			} else {
				alert("未挖掘出频繁模式，请修改数据或调低参数");
			}

		},
		error: function (result) {
			console.log(result);
			alert("异常！");
			submitted = false;
			$('#final_image').attr('src', '/static/rhythm/img/instruction_fre.png');
		}
	});
}

function handle(result, formData) {
	show_freq_table();
	var freq_rules = result["freq_rules"];
	//	console.log(freq_rules);
	var length = result["freq_rules_count"];

	//	var keyAry = ["星期", "小时", "天气", "O点编码", "D点编码"];

	// 清除上次渲染的表格
	$("#tbody_freq_1").empty();
	$("#tbody_freq_2").empty();
	nrules = 0; //保存挖掘到符合条件的频繁模式的数量
	Rules = []; //保存符合条件的频繁模式

	//筛选频繁模式且绘制表格
	for (var i = 0; i < length; i++) {
		//前键
		var frontkey = freq_rules[i][0];
		//后键
		var backkey = freq_rules[i][1];
		//频繁模式出现次数
		var count = freq_rules[i][2];
		//置信度
		var conf = freq_rules[i][3];
		//{'flags','data'}
		var front = handle_data(frontkey);
		var back = handle_data(backkey);

		//筛选掉不符合条件的模式
		var flag_front = check_freq_front(front);
		var flag_back = check_freq_back(back);

		if (flag_back == false) {
			continue;
		}
		if (flag_front != true || flag_back != true) {

			continue;
		}

		//更新Rules
		var trules = {
			"front_flags": front.flags,
			"front_data": front.data,
			"back_flags": back.flags,
			"back_data": back.data
		};
		Rules[nrules] = trules;
		nrules++;

		//		console.log("here",front.data,back.data);
		//填充前键内容
		var trf = $("<tr></tr>");
		var front_data = front["data"];
		for (var j = 0; j < 3; j++) {
			trf.append("<td>" + front_data[j] + "</td>");

		}
		//		trf.append("<td>" + conf.toFixed(2) + "</td>");
		trf.appendTo($("#tbody_freq_1"));
		//填充后键内容
		var trb = $("<tr></tr>");
		var back_data = back["data"];
		for (var j = 3; j < 7; j++) {
			trb.append("<td>" + back_data[j] + "</td>");
		}
		trb.append("<td>" + conf.toFixed(2) + "</td>");
		trb.append("<td><a onClick='show_fre_image(" + (nrules - 1) + ")' class='show_a'>Click</a></td>")
		trb.appendTo($("#tbody_freq_2"));
	}
	//	console.log(nrules);
	//	console.log(Rules);
	// 
	//		for (var i = 0; i < data.length; i++) {
	//		var tr = $("<tr></tr>");
	//		for (var j = 0; j < keyAry.length; j++) {
	//			tr.append("<td>" + data[i][keyAry[j]] + "</td>");
	//		}
	//		tr.appendTo($("#tbody_frequent_minning"));
	//	}
}

function check_freq_back(back) {
	//day_of_week:0-1,time:2-3,weather:4-5,o_poi:6-14,d_poi:15-23,o_num:24-123,d_num:124-223
	//后键必须有o_num和d_num,不能有day_of_week,time,weather
	var data = back.data;
	var flags = back.flags;
	if (flags[0] == true || flags[1] == true || flags[2] == true) {
		return false;
	}
	if (flags[5] == false || flags[6] == false) {
		return false;
	}
	return true;
}

function check_freq_front(front) {
	//前键一定不会出现o_poi,d_poi,o_num,d_num
	var data = front.data;
	var flags = front.flags;
	if (flags[3] == true || flags[4] == true || flags[5] == true || flags[6] == true) {
		return false;
	}
	//day_of_week:0-1,time:2-3,weather:4-5,o_poi:6-14,d_poi:15-23,o_num:24-123,d_num:124-223
	//根据用户选择情况，筛选week,time,weather
	var checked_time = $('#method_freq_time option:selected').val();
	var checked_week = $('#method_freq_week option:selected').val();
	var checked_weather = $('#method_freq_weather option:selected').val();
	if (checked_week != "全部") {
		//		console.log("不是全部",checked_week);
		if (checked_week != data[0] || flags[0] == false) {
			return false;
		}
	}
	if (checked_time != "全部") {
		//		console.log("不是全部",checked_time);
		if (checked_time != data[1] || flags[1] == false) {
			return false;
		}
	}
	if (checked_weather != "全部") {
		console.log("不是全部", checked_weather);
		if (checked_weather != data[2] || flags[2] == false) {
			return false;
		}
	}
	return true;
}

function handle_data(itemset) {
	//	console.log(itemset);
	var l = itemset.length;
	var week = ["工作日", "休息日"];
	var time = ["白天", "夜晚"];
	var weather = ["晴天", "阴雨天"];
	var POI = ["餐饮服务", "汽车服务", "购物服务", "生活服务", "公共设施服务", "商务住宅", "交通设施服务", "公司企业", "风景名胜"];
	//day_of_week:0-1,time:2-3,weather:4-5,o_poi:6-14,d_poi:15-23,o_num:24-123,d_num:124-223
	var flags = [false, false, false, false, false, false, false];
	var data = ["", "", "", "", "", "", ""];
	for (var i = 0; i < l; i++) {
		var tmp = parseInt(itemset[i]);
		if (0 <= tmp && tmp <= 1) { //week
			flags[0] = true;
			data[0] = week[tmp];
		} else if (2 <= tmp && tmp <= 3) { //time
			flags[1] = true;
			data[1] = time[tmp - 2];
		} else if (4 <= tmp && tmp <= 5) { //weather
			flags[2] = true;
			data[2] = weather[tmp - 4];
		} else if (6 <= tmp && tmp <= 14) { //o_poi
			flags[3] = true;
			data[3] = POI[tmp - 6];
			//			data[3] = (tmp-50).toString();
		} else if (15 <= tmp && tmp <= 23) { //d_poi
			flags[4] = true;
			data[4] = POI[tmp - 15];
		} else if (24 <= tmp && tmp <= 123) { //o_num
			flags[5] = true;
			data[5] = (tmp - 24).toString();
		} else if (124 <= tmp && tmp <= 223) { //d_num
			flags[6] = true;
			data[6] = (tmp - 124).toString();
		}
	}

	var ans = {
		'flags': flags,
		'data': data
	};
	return ans;
}

function show_freq_table() {
	$("#chart_freq").addClass("display");
	$("#table_p_freq").removeClass("display");
}
// JavaScript Document
var wb; //读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
function importf_frequent_minning(obj) {
	console.log(obj.val);
	var flag = check_freq_file();
	if (flag == false) {
		return;
	}


	if (!obj.files) {
		return;
	}
	//	测试表格显示功能
	//	show_table_frequent_minning(obj);
	//提交文件
	submit_file_frequent_minning(obj);

}

function check_freq_file() {
	
	var obj = $("input[name='csv_input_freq']").val();
	console.log(obj);
	// 判断文件是否为空 
	if (obj == "") {
		alert("请选择上传的目标文件");
		return false;
	}

//	console.log(obj);
	//判断文件类型,要求是csv文件
	var fileName1 = obj.substring(obj.lastIndexOf(".") + 1).toLowerCase();
	if (fileName1 != "csv") {
		alert("请选择csv文件!");
		return false;
	}
	//判断文件大小
	var size1 = $("input[name='csv_input_freq']")[0].files[0].size;
	if (size1 > 41943040) {
		alert("上传文件不能大于40M!");
		return false;
	}
}
//提交文件
function submit_file_frequent_minning(obj) {

	var csrftoken = getCookie('csrftoken');
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
	//访问服务器。

	var type = "od_file";
	var formData = new FormData(); //这里需要实例化一个FormData来进行文件上传
	formData.append(type, $("#csv_input_freq")[0].files[0]);
	console.log(formData);
	$.ajax({
		type: "post",
		url: "upload_od",
		data: formData,
		processData: false,
		contentType: false,
		success: function (result) {
			console.log(result);
			var res = JSON.parse(result).error;
			if (res == "") {
				alert("数据上传成功")
				file_submitted = true;
				token = JSON.parse(result).od_token;
				point_pairs = JSON.parse(result).point_pairs;
				show_table_frequent_minning(obj);
			} else {
				alert("上传失败 " + res);
				file_submitted = false;
				token = "";
			}

		},
		error: function (result) {
			console.log(result);
			//			alert("异常！");
			alert("上传失败");
			file_submitted = false;
			token = "";
		}
	});

}

function show_table_frequent_minning(obj) {

	var f = obj.files[0];
	var reader = new FileReader();
	reader.onload = function (e) {
		//		console.log(file_submitted);

		//		if(file_submitted == false){
		//			return;
		//		}
		// console.log(e.target.result);
		if (rABS) {
			wb = XLSX.read(btoa(fixdata(e.target.result)), { //手动转化
				type: 'base64'
			});
		} else {
			wb = XLSX.read(e.target.result, {
				type: 'binary'
			});
		}

		//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
		//wb.Sheets[Sheet名]获取第一个Sheet的数据
		var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
		//		console.log(data);
		var keyAry = [];
		// 遍历json对象，获取每一列的键名,即表头
		for (var key in data[1]) {
			keyAry.push(key);
		}
		// 清除上次渲染的表格
		$("#tbody_frequent_minning").empty();
		// 设置表格头
		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr></tr>");
			for (var j = 0; j < keyAry.length; j++) {
				tr.append("<td>" + data[i][keyAry[j]] + "</td>");
			}
			tr.appendTo($("#tbody_frequent_minning"));
		}

	}

	if (rABS) {
		reader.readAsArrayBuffer(f);
	} else {
		reader.readAsBinaryString(f);
	}
}

function fixdata(data) { //文件流转BinaryStrings
	var o = "",
		l = 0,
		w = 10240;
	jsArry = [];
	for (; l < data.byteLength / w; ++l)
		jsArry.push(String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w))));
	return jsArry;
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

function show_fre_image(a) {
	
	var trules = Rules[a];
	var front_data = trules.front_data;
	var back_data = trules.back_data;
	var o_gps = point_pairs[back_data[5]];
	var d_gps = point_pairs[back_data[6]];
	//	alert(a);
	var len = 2; //点的数量
	var x = new Array(); //点的经度
	//	for (i = 0; i < len; i++) {
	////		x[i] = result["idx_gps"][i][1];
	//		x[]
	//	}

	var y = new Array(); //点的纬度
	x[0] = o_gps[1];
	x[1] = d_gps[1];
	y[0] = o_gps[0];
	y[1] = d_gps[0];
	//	for (i = 0; i < len; i++) {
	//		y[i] = result["idx_gps"][i][0];
	//	}
	//	var maps = result["sum_matrix"];
	var maps = [
		["O点", front_data[0] + "  " + front_data[1] + "  " + front_data[2]],
		[0, "D点"]
	];
	var value = new Array();
	for (i = 0; i < len; i++) {
		value[i] = maps[i][i];
		//		value[i] = 233;
	}

	//	$("#final_image").hide();
	//	$("#chart_1").addClass("div_method8")
	$('#chart_freq_show').width($('#chart_freq_show').width());
	$('#chart_freq_show').height($('#chart_freq_show').height());
	var dom = document.getElementById("chart_freq_show");
	console.log('here', dom);
//	alert(a);
	var myChart = echarts.init(dom);
	myChart.clear();

	option = {
		tooltip: {
			trigger: 'item',
			show: true,

		},
		title:{
			text:(function(){
				return '星期:'+front_data[0]+'\n时间:'+front_data[1]+'\n天气:'+front_data[2]+'\nO点POI:'+back_data[3]+'\nD点POI:'+back_data[4];
			})()
//			backgroundColor:"rgba(0, 0, 0)",
//			borderColor:"#FFF"
		},
		bmap: {
			center: [104.1, 30.68],
			zoom: 12,
			roam: true,

		},
		series: [{
			type: 'graph',
			layout: 'none', //使用x，y作为位置
			legendHoverLink: true,
			coordinateSystem: 'bmap',
			roam: true, //可缩放和平移漫游
			focusNodeAdjacency: false, //选取某节点时高亮相邻的边和节点
			symbol: "circle", //节点形状
			symbolSize: 40,
			data: (function () {
				var t = [];
				for (var i = 1; i <= len; i++) {
					var tmp = {
						number: 'No' + i,
						fax: value[i - 1],
						name: 'No' + i,
						value: [x[i - 1], y[i - 1], value[i - 1]],
						itemStyle: {
							color: (function () {
								var colorList = ['#EE1289', '#DC143C', '	#E066FF', '#FF1493', '#FF6347', '#FF0000', '#B23AEE', '#BA55D3', '#C71585', '#9B30FF', '#969696', '#8E388E', '#8B008B', '#7D9EC0', '#7A7A7A', '#7A67EE', '#696969', '#515151', '#404040', '#12121', '#191970', '#00CD66', '#0000EE', '#00CDCD', '#7D26CD', '#71C671', '#76EE00', '#87CEFA', '#698B22', '#7171C6', '#ADADAD', '#DEB887'];
								return colorList[Math.floor(Math.random() * colorList.length)];
							})()

						},
						label: { //节点显示的标识
							normal: {
								show: true,
								formatter: (function () {
									return maps[i - 1][i - 1] + "";
								})()
							}
						},
						tooltip: {
							formatter: (function () {
								var str = '(' + y[i - 1] + ',' + x[i - 1] + ')';
								var spoi;
								var spoint;
								if (i == 1) {
									spoi = back_data[3];
									spoint = "O点";
								} else if (i == 2) {
									spoi = back_data[4];
									spoint = "D点";
								}
								return spoint + " " + spoi + ' (' + y[i - 1] + ',' + x[i - 1] + ')';
							})(),
							textStyle: {
								fontFamily: 'Verdana, sans-serif',
								fontSize: 15,
								fontWeight: 'bold'
							}
						}
					}
					t.push(tmp);
				}
				return t;
			})(),
			// links: [],
			links: (function () {
				var t = [];

				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len; j++) {
						if (maps[i][j] != 0 && i != j) {
							var tmp = {
								source: i,
								target: j,
								value: maps[i][j],
								symbolSize: [0.1, 10],
								symbol: ['none', 'arrow'],
								lineStyle: {
									normal: {
										width: 4,
										color: 'source',
									},
									emphasis: {
										width: 5
									}

								},
								label: {
									normal: {
										show: true,
										position: 'middle',
										fontSize: 15,
										formatter: ' {@value}'
									},
									emphasis: {
										show: true
									}
								}
							}
							t.push(tmp);
						}
					}
				}
				return t;
			})()
		}]
	};

	myChart.setOption(option, true);
	$("body,html").scrollTop(600);
}
