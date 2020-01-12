// JavaScript Document
var wb;//读取完成的数据
var rABS = false; //是否将文件读取为二进制字符串
function importf_frequent_minning(obj){
	console.log(obj.val);
	var flag = check_file();
	if(flag == false){
		return;
	}
	
	
	if(!obj.files) {
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
	if(size1 > 41943040){
		alert("上传文件不能大于40M!");
		return false;
	}
}
//还没改呢
function submit_file_frequent_minning(obj){
	
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
			if( res == ""){
				alert("数据上传成功")
				file_submitted = true;
				token = JSON.parse(result).token;
				show_table_frequent_minning(obj);
			}else{
				alert("上传失败 "+ res);
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
function show_table_frequent_minning(obj){
		
	var f = obj.files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
//		console.log(file_submitted);
		
//		if(file_submitted == false){
//			return;
//		}
		// console.log(e.target.result);
		if(rABS) {
			wb = XLSX.read(btoa(fixdata(e.target.result)), {//手动转化
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
		for(var key in data[1]){
			keyAry.push(key);
		}
		// 清除上次渲染的表格
		$("#tbody_frequent_minning").empty();
		// 设置表格头
		for (var i=0;i<data.length;i++ ){
			var tr = $("<tr></tr>");
			for(var j=0;j<keyAry.length;j++){
				tr.append("<td>"+ data[i][keyAry[j]] + "</td>");
			}
			tr.appendTo($("#tbody_frequent_minning"));
		}
		
	}	
	
	if(rABS) {
		reader.readAsArrayBuffer(f);
	} else {
		reader.readAsBinaryString(f);
	}
}
function fixdata(data) { //文件流转BinaryStrings
	var o = "",
		l = 0,
		w = 10240;
	jsArry=[];
	for(; l < data.byteLength / w; ++l) 
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