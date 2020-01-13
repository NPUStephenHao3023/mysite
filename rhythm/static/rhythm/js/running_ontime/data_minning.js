var submitted = false; //submitted变量用于保证加载过程中不能重复提交
var file_submitted = false; //判断是否已经提交了文件
var token = ""; //使用token将同一客户端上传文件和请求的图片相对应
$(function () {
	nav();
})

function nav() {
	hide_freq_table();
}

function hide_freq_table() {
	$("#table_p_freq").addClass("display");
}


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
			$('#final_image').attr('src', '/static/rhythm/img/instruction.png');
		}
	});
}

function handle(result, formData) {
	show_freq_table();
	var freq_rules = result["freq_rules"];
	console.log(freq_rules);
	var length = result["freq_rules_count"];
	
	var keyAry = ["星期", "小时", "天气", "O点编码", "D点编码"];
	// 遍历json对象，获取每一列的键名,即表头
	//	for (var key in data[1]) {
	//		keyAry.push(key);
	//	}
	// 清除上次渲染的表格
	$("#tbody_freq_1").empty();
	$("#tbody_freq_2").empty();

	for (var i = length-1; i>=0 ; i--){
		if(i!=length-1){
			return;
		}
		var frontkey = freq_rules[i][0];
		var backkey = freq_rules[i][1];
		var count = freq_rules[i][2];
		var conf = freq_rules[i][3];
		var front_data = handle_data(frontkey);
		var back_data = handle_data(backkey);
	}
	// 
//		for (var i = 0; i < data.length; i++) {
//		var tr = $("<tr></tr>");
//		for (var j = 0; j < keyAry.length; j++) {
//			tr.append("<td>" + data[i][keyAry[j]] + "</td>");
//		}
//		tr.appendTo($("#tbody_frequent_minning"));
//	}
}
function handle_data(itemset){
	console.log(itemset);
	var l = itemset.length;
    var flags = [false,false,false,false,false];
	var data = ["","","","",""];
	for(var i=0;i<l;i++){
		var tmp =  parseInt(itemset[i]);
//		if()
	}
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
	var flag = check_file();
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

function check_file() {
	var obj = $("input[name='csv_input_freq']").val();
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
	var size1 = $("input[name='csv_input_freq']")[0].files[0].size;
	if (size1 > 41943040) {
		alert("上传文件不能大于40M!");
		return false;
	}
}
//还没改呢
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
		console.log(data);
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
