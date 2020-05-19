// JavaScript Document
var submitted = false; //submitted变量用于保证加载过程中不能重复提交
var file_submitted = false; //判断是否已经提交了文件
var token = ""; //使用token将同一客户端上传文件和请求的图片相对应
//var point_pairs; //保存划分区域的坐标信息。
var nrules = 0; //保存挖掘到符合条件的频繁模式的数量
var Rules; //保存挖掘到符合条件的频繁模式
$(function () {
	//	alert("seq");
	nav();
})

function nav() {
	hide_freq_table();
}

function hide_freq_table() {
	$("#table_p_seq").addClass("display");
	$("#table_p_freq").addClass("display");
}

//请求序列模式挖掘
function submit_sequential_minning() {
	//	show_freq_table();
	var csrftoken = getCookie('csrftoken');
	//包装数据
	var formData = {
		'sup': '0.1',
		'conf': '0.1',
		'token': token,
		//		'sup': $('input[name=suppport_degree_seq]').val(),
		//		'conf': $('input[name=confidence_level_seq]').val(),
		'time': $('#method_seq_time option:selected').val(),
		'weather': $('#method_seq_weather option:selected').val(),
		'dayofweek': $("#method_seq_week option:selected").val()
		//		"token": token
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
		url: "sequential_mining/", //url
		data: formData,
		success: function (result) {
			//有返回值
			console.log(result);
			submitted = false;
			//console.log(result["is_seq_empty"]);
			if (result["is_seq_empty"] == false) {
				$.getJSON('/static/rhythm/json/seq_encoding.json', function (seq_encoding) {
					console.log(seq_encoding);
					handle_seq(result, formData, seq_encoding);
				});
				//				handle_seq(result, formData);
			} else {
				alert("未挖掘出频繁模式，请修改数据或调低参数");
			}

		},
		error: function (result) {
			console.log(result);
			alert("异常！");
			submitted = false;
			$('#final_image').attr('src', '/static/rhythm/img/instruction_seq.png');
		}
	});
}

function handle_seq(result, formDat, seq_encoding) {
	show_seq_table();
	var rules_count = result.seq_rules_count;
	var seq_rules = result.seq_rules;
	var length = seq_rules.length;

	$("#tbody_seq_1").empty();
	//	$("#tbody_seq_2").empty();
	nrules = 0;
	Rules = [];
	for (var i = 0; i < length; i++) {
		//		console.log("here");
		var frontkey = seq_rules[i][0];
		var backkey = seq_rules[i][1];
		var count = seq_rules[i][2];
		var conf = seq_rules[i][3];

		var front = handle_seq_data(frontkey, seq_encoding);
		var back = handle_seq_data(backkey, seq_encoding);
		if (front.flag == false || back.flag == false) {
			continue;
		}
		//		console.log(front,back,i)
		var trf = $("<tr></tr>");


		var trules = {
			"front_names": front.road_names,
			"front_coords": front.road_coords,
			"front_count": front.count,
			"back_names": back.road_names,
			"back_coords": back.road_coords,
			"back_count": back.count,
			"front_length": front.road_length,
			"back_length": back.road_length
		};
		Rules[nrules] = trules;
		nrules++;
		//前键序列
		var front_name = front.road_names;
		var fstr = "<td>";
		for (var j = 0; j < front.count; j++) {
			fstr = fstr + front_name[j] +"("+front.seq_set[j] + ")  ";
		}
		fstr += "</td>";
		trf.append(fstr);
		//后键序列
		var back_name = back.road_names;
		var bstr = "<td>";
		for (var j = 0; j < back.count; j++) {
			bstr = bstr + back_name[j] + "("+back.seq_set[j] + ")  ";
		}
		bstr += "</td>";
		trf.append(bstr);
		//		console.log(fstr);
		trf.append("<td>" + conf.toFixed(2) + "</td>");
		trf.append("<td><a onClick='show_seq_image(" + (nrules - 1) + ")' class='show_a'>Click</a></td>")
		trf.appendTo($("#tbody_seq_1"));
	}
}

function handle_seq_data(seqset, seq_encoding) {
	var l = seqset.length;
	var road_names = [];
	var road_coords = [];
	var seq_set = [];
	var road_length = [];
	var ans;
	var count = 0;
	for (var i = 0; i < l; i++) {
		var code = seqset[i];
		if (seq_encoding.hasOwnProperty(seqset[i].toString())) {
			var tmp = seq_encoding[seqset[i].toString()]
			if (tmp["road_name"] instanceof Array) {
				road_names[count] = tmp["road_name"][0];
			} else {
				//				console.log(tmp["road_name"]);
				road_names[count] = tmp["road_name"];
			}
			road_coords[count] = tmp.road_coords;
			seq_set[count] = seqset[i].toString();
			road_length[count] = tmp.road_length;
			count++;
		} else {
			//阐述空包含空字符串的键
			return {
				"flag": false
			};
//			continue;
		}
	}
	if (count == 0) {
		return {
			"flag": false
		}
	}
	return ans = {
		"flag": true,
		"road_names": road_names,
		"road_coords": road_coords,
		"road_length": road_length,
		"seq_set": seq_set,
		"count": count
	};
}

function show_seq_table() {
	$("#chart_seq").addClass("display");
	$("#table_p_seq").removeClass("display");
}
var wb; //读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
function importf_sequential_minning(obj) {
	console.log(obj.val);
//	var flag = check_file();
//	if (flag == false) {
//		return;
//	}


	if (!obj.files) {
		return;
	}
	//	测试表格显示功能
	//	show_table_frequent_minning(obj);
	//提交文件
	submit_file_sequential_minning(obj);

}

function check_file() {
	var obj = $("input[name='csv_input_seq']").val();
	// 判断文件是否为空 
	if (obj == "") {
		alert("请选择上传的目标文件");
		return false;
	}

	console.log(obj);
	//判断文件类型,要求是csv文件
	var fileName1 = obj.substring(obj.lastIndexOf(".") + 1).toLowerCase();
	if (fileName1 != "csv") {
		alert("请选择csv文件!");
		return false;
	}
	//判断文件大小
	var size1 = $("input[name='csv_input_seq']")[0].files[0].size;
	if (size1 > 41943040) {
		alert("上传文件不能大于40M!");
		return false;
	}
}
//提交文件
function submit_file_sequential_minning(obj) {
	var csrftoken = getCookie('csrftoken');
	$.ajaxSetup({
		beforeSend: function (xhr, settings) {
			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});
	//访问服务器。

	var type = "traj_file";
	var formData = new FormData(); //这里需要实例化一个FormData来进行文件上传
	formData.append(type, $("#csv_input_seq")[0].files[0]);
	console.log(formData);
	$.ajax({
		type: "post",
		url: "upload_traj",
		data: formData,
		processData: false,
		contentType: false,
		success: function (result) {
			console.log(result);
			var res = JSON.parse(result).error;
			if (res == "") {
				alert("数据上传成功")
				file_submitted = true;
				token = JSON.parse(result).seq_token;
				show_table_sequential_minning(obj);
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

function show_table_sequential_minning(obj) {

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
		$("#tbody_sequential_minning").empty();
		// 设置表格头
		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr></tr>");
			for (var j = 0; j < keyAry.length; j++) {
				tr.append("<td>" + data[i][keyAry[j]] + "</td>");
			}
			tr.appendTo($("#tbody_sequential_minning"));
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
function show_seq_image(index) {
	var new_element = document.createElement("script");
	new_element.setAttribute("type", "text/javascript");
	new_element.setAttribute("src", "/static/rhythm/js/coordinate_transformation.js"); // 在这里引入了a.js
	document.body.appendChild(new_element);
	var rules = Rules[index];
	var road_line = [];
	for (var i = 0; i < rules.front_count; i++) {
		var tmp = {
			"road_name": rules.front_names[i],
			"road_length": rules.front_length[i],
			"road_coords": rules.front_coords[i]
		}
		road_line.push(tmp);
	}
	for (var i = 0; i < rules.back_count; i++) {
		var tmp = {
			"road_name": rules.back_names[i],
			"road_length": rules.back_length[i],
			"road_coords": rules.back_coords[i]
		}
		road_line.push(tmp);
	}
	var result = {
		"road_line_poi_list": road_line
	};
	makeseq_roadsection(result, rules);
}
function makeseq_roadsection(data, rules) {
	console.log(data, 'data');

	var road_list = handle_road_list(data['road_line_poi_list']);
	//length:路段数
	var length = road_list.length;
	console.log(road_list, 'road_list');

	var myChart = echarts.init(document.getElementById("chart_seq_show"));
	var app = {};
	var option = null;
	app.title = '序列模式挖掘结果';



	var option = {
		title: {
			text: "红线表示前键，蓝线表示后键"
		},
		tooltip: {
			show: true,
			trigger: 'item',
			//			formatter: '{b}'
			formatter: function (params, ticket, callback) {
				console.log(params);
				//				var poi = params[0].data.poi;
				//				var value = params[0].value;
				//				var name = params[0].name;
				//				return value + "<br/> POI:" + poi;
				return params.data.name;
			}
		},
		bmap: {


			center: [104.07, 30.68],
			zoom: 13,
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
				for (var i = 0; i < length; i++) {
					var tmp = {
						name: '名称:' + data['road_line_poi_list'][i]['road_name'] + '\n长度:' + data['road_line_poi_list'][i]['road_length'].toFixed(2) + ' m',
						coords: road_list[i],
						number: i,
						lineStyle: {
							color: (function () {
								if (i < rules["front_count"]) {
									return "#8B0000";
								} else {
									return "#00008B";
								}
							})(),
							//							opacity: 1,
							width: 5,
							curveness: 1
						}
					}
					t.push(tmp);
				}

				return t;
			})(),
			silent: false, //
			symbol: 'circle',
			progressiveThreshold: 500,
			progressive: 200,
			animation: false
		}]
	};
	console.log(option.series[0].data);
	myChart.setOption(option)

	window.addEventListener('resize', function () {
		myChart.resize();
	});
}

//将poi频率向量转换成poi概率向量
function handle_data(data) {
	var length = data.length;
	var t = [];
	var sum = 0;
	for (var i = 0; i < length; i++) {
		sum += data[i];
	}
	for (var ii = 0; ii < length; ii++) {
		var tmp = data[ii] * 1.0 / (sum + 0.0);
		t.push(tmp);
	}
	return t;
}