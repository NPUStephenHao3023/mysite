//table_showdatatable_showdatatable_showdatatable_showdatatable_showdatatable_showdata
var submitted = false; //submitted变量用于保证加载过程中不能重复提交
var file_submitted = false; //判断是否已经提交了文件
var token = ""; //使用token将同一客户端上传文件和请求的图片相对应
var point_pairs; //保存划分区域的坐标信息。
var Pattern_list = [];
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
//	$("#table_p_freq").removeClass("display");
//}


//请求频繁模式挖掘
function submit_frequent_minning() {
//	var csrftoken = getCookie('csrftoken');
	//包装数据
	var formData = {
		'sup': $('input[name=suppport_degree_freq]').val(),
		'conf': 0.1,
		"token": token
	};
	//如果正在加载则不能重复提交
	if (submitted == true) {
		alert("正在加载请耐心等待！");
		return;
	}
	//判断是否选择了数据集
//	if (file_submitted == false) {
//		alert("请上传数据集！");
//		return;
//	}

	console.log(formData);
	//发送后submited=true，并更换加载图片，表示正在加载。
	submitted = true;
	$('#final_image').attr('src', '/static/rhythm/img/loading.gif');

	var url = "/static/rhythm/json/new_fr_rules.json";
	$.getJSON(url, function (result) {
		console.log(result);
		handle(result);
		$("#radio").html("跨域数据占比：87.5%");
		submitted = false;
	});
	
	//发送请求
//	$.ajaxSetup({
//		beforeSend: function (xhr, settings) {
//			if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
//				xhr.setRequestHeader("X-CSRFToken", csrftoken);
//			}
//		}
//	});

	//访问服务器。
//	$.ajax({
//		//几个参数需要注意一下
//		type: "POST", //方法类型
//		dataType: "json", //预期服务器返回的数据类型
//		url: "frequent_mining/", //url
//		data: formData,
//		success: function (result) {
//			//有返回值
//			console.log(result);
//
//			//判断频繁子集是否为空
//			if (result["is_itemset_empty"] == false) {
//
//				handle(result, formData);
//			} else {
//				alert("未挖掘出频繁模式，请修改数据或调低参数");
//			}
//			submitted = false;
//
//		},
//		error: function (result) {
//			console.log(result);
//			alert("异常！");
//			submitted = false;
//			$('#final_image').attr('src', '/static/rhythm/img/instruction_fre.png');
//		}
//	});
}
//处理频繁项集，筛选出必要的
function handle(result, formData) {
	//频繁项集
	var itemsets = result;
	//频繁项集的数据
	var Length = itemsets.length;
	//清空之前显示的表格
	$("tbody_freq_2").empty();
	//保存满足条件的频繁模式,只要有两个跨域数据集
	npattern = 0;
	//存储满足条件的频繁模式。
	Pattern = [];
	//图结构的类型
	Types = [];
	//遍历频繁项集
	for (var i = 0; i < Length; i++) {
		var tmpsets = itemsets[i];//当前路段
		var tsup = tmpsets.support; //支持度
		var tfield = handle_cross_data(tmpsets.itemset,tmpsets.roads); //检查包含哪些字段
		//检查该项集包括哪些域，检查字段之间是否存在矛盾。
		var tpattern = find_cross_domain(tfield);
		var pflag = check_pattern(tpattern);
		if(pflag == -1 ){
			continue;
		}
		tpattern["support"] = tsup;
		Pattern.push(tpattern);
		Types.push(pflag);
//			console.log(tdomain);
	}
	var Domains= ["天气域","时间域","空间域","地理语义域","路网域","移动轨迹域"];
	var pLength = Pattern.length;
	PatternList = Pattern;
	for(var i=0;i<pLength;i++){
		var tPattern = Pattern[i];
		var tsup = Pattern.support;
		var tr = $("<tr></tr>");
		tr.append("<td>"+(i+1)+"</td>");//序号
		tr.append("<td>"+tPattern.domainNUm+"</td>");//跨域种类
		var str="";
		var dnum=0;
		var dsum = 0;
		var dflag = false;
		for(var j=0;j<tPattern.domainFlags.length;j++){
			if(tPattern.domainFlags[j] == true){
				dsum++;
			}
		}
		for(var j=0;j<tPattern.domainFlags.length;j++){
			if(tPattern.domainFlags[j] == true){
				str+=Domains[j]+" ";
				dnum++;
			}
			
			if(dnum==3&&dsum>dnum&&dflag==false){
				str+='<br>';
				dflag = true;
			}

		}
		tr.append("<td>"+str+"</td>");
		tr.append("<td>"+tPattern.support+"</td>");
		tr.append("<td><a onClick='show_fre_image(" + i +"," + Types[i] + ")' class='show_a'>Click</a></td>")
		tr.appendTo($("#tbody_freq_2"));
	}



}
function show_fre_image(index,type){
	if(type == 1){
		show_chart_1(PatternList[index]);
	}else if(type == 2){
		show_chart_2(PatternList[index]);
	}else if(type == 3){
		show_chart_3(PatternList[index]);
	}else if(type==4){
		show_chart_4(PatternList[index]);
	}else if(type==5){
		show_chart_5(PatternList[index]);
	}else if(type==6){
		show_chart_6(PatternList[index]);
	}
}
//检查该模式是否符合要求，以及该模式属于那种情况。
function check_pattern(tpattern){
	if(tpattern.flag==false){
		return -1;
	} 
	var domainFlags = tpattern.domainFlags;
	var fieldFlags = tpattern.fieldFlags;
	var data = tpattern.Data;
	var roadData = tpattern.roadData;
	
	//字段至少有两个
	var num = 0;
	for(var i=0;i<fieldFlags.length;i++){
		if(fieldFlags[i] == true){
			num++;
		}
	}
	if(num<=1){
		return -1;
	}
	//如果OD点都有，属于情况1
	if(fieldFlags[5]==true&&fieldFlags[6]==true){
		return 1;
	}else if((fieldFlags[5]==true&&fieldFlags[6]==false)||(fieldFlags[5]==false&&fieldFlags[6]==true)){//OD点只有一个，属于情况2
		return 2;	
	}else if(fieldFlags[3]==true&&fieldFlags[4]==true){//两个POI点，属于情况3
		return 3;
	}else if((fieldFlags[3]==true&&fieldFlags[4]==false)||(fieldFlags[3]==false&&fieldFlags[4]==true)){//单个POI点，属于情况4
		return 4;
	}else if(fieldFlags[2]==true){//没有POI点，属于情况5
		return 5;
	}else{//有天气
		return 6;
	}

}
//检查该项集包括哪些域，检查字段之间是否存在矛盾。
function find_cross_domain(data) {
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var dflag = data.flags;
	var ddata = data.data;
	var droadData = data.roadData;
	var dnum = 0;
	//0天气域，1时间域，2空间域，3POI域，4路网域，5轨迹域
	var flag = true; //判断各字段是否存在矛盾
	var domainFlags = [false, false, false, false, false, false]; //域
	var fieldFlags = [false, false, false, false, false, false, false, false]; //字段
	//week,time,weather,o_poi,d_poi,o_num,d_num,road
	var fieldData = ["", "", "", "", "", "", ""];
	var roadData = [];
	if (dflag[2] == true) { //天气域
		domainFlags[0] = true;
		fieldFlags[2] = true;
		fieldData[2] = ddata[2];
	}
	if (dflag[0] == true || dflag[1] == true) { //时间域
		domainFlags[1] = true;
		if (dflag[0] == true) {
			fieldFlags[0] = true;
			fieldData[0] = ddata[0];
		}
		if (dflag[1] == true) {
			fieldFlags[1] = true;
			fieldData[1] = ddata[1];
		}
	}
	if (dflag[5] == true || dflag[6] == true) { //空间域,空间域和轨迹域是同时存在的。
		domainFlags[2] = true;
		if (dflag[5] == true) {
			fieldFlags[5] = true;
			fieldData[5] = ddata[5];
			domainFlags[5] = true;
		}
		if (dflag[6] == true) {
			fieldFlags[6] = true;
			fieldData[6] = ddata[6];
			domainFlags[5] = true;
		}
	}

	if (dflag[7] == true) { //路网域和轨迹域,要求OD点同时存在且存在轨迹
		if (fieldFlags[5] == true && fieldFlags[6] == true) {
			domainFlags[4] = true;
			fieldFlags[7] = true;
			roadData = droadData;
		} else {
			flag = false;
		}
	}
	if (dflag[3] == true || dflag[4] == true) { //POI域，要求OD点poi存在时，d点poi也存在
		if (fieldFlags[5] == false && fieldFlags[6] == false) { //OD点都不存在，则OD点POI都可以存在
			if (dflag[3] == true) {
				domainFlags[3] = true;
				fieldFlags[3] = true;
				fieldData[3] = ddata[3];

			}
			if (dflag[4] == true) {
				domainFlags[3] = true;
				fieldData[4] = ddata[4];
				fieldFlags[4] = true;
			}
		} else { //OD点至少存在一个时，POi要与od点对应
			if (dflag[3] == true) {
				if (fieldFlags[5] == true) {
					domainFlags[3] = true;
					fieldFlags[3] = true;
					fieldData[3] = ddata[3];
				} else {
					flag = false;
				}

			}
			if (dflag[4] == true) {
				if (fieldFlags[6] == true) {
					domainFlags[3] = true;
					fieldData[4] = ddata[4];
					fieldFlags[4] = true;
				} else {
					flag = false;
				}

			}
		}
	}
	for(var i=0;i<domainFlags.length;i++){
		if(domainFlags[i]==true){
			dnum++;
		}
	}
	var ans = {
		"flag": flag, //判断字段是否存在矛盾
		"domainFlags": domainFlags, //包含的域
		"fieldFlags": fieldFlags, //包含的字段
		"Data": fieldData, //具体字段内容
		"roadData": roadData, //轨迹数据
		"domainNUm":dnum//包含域的数量
	};
//	console.log(data,ans);
	return ans;

}



//处理数据，检查该频繁模式都包括哪些字段
function handle_cross_data(itemset,roads) {
	//	console.log(itemset);
	var l = itemset.length;
	var week = ["工作日", "休息日"];
	var time = ["白天", "夜晚"];
	var weather = ["晴天", "阴雨天"];
	var POI = ["餐饮服务", "汽车服务", "购物服务", "生活服务", "公共设施服务", "商务住宅", "交通设施服务", "公司企业", "风景名胜"];
	//day_of_week:0-1,time:2-3,weather:4-5,o_poi:6-14,d_poi:15-23,o_num:24-123,d_num:124-223，轨迹数据额外编码
	var flags = [false, false, false, false, false, false, false, false];
	//week,time,weather,o_poi,d_poi,o_num,d_num
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
	if(roads.length!=0){
		flags[7] = true;
	}
	var ans = {
		'flags': flags, //各个字段是否存在。
		'data': data, //各个字段对应数据,与flags对应
		'roadData': roads //轨迹数据
	};
//	console.log(itemset,roads,ans);
	
	return ans;

}


//把图片替换成表格，暂不使用
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

//function show_fre_image(a) {
//	var trules = Rules[a];
//	console.log("trules:",trules);
//	var front_data = trules.front_data;
//	var back_data = trules.back_data;
//	//o_gps，d_gps:两组点对分别表示划分范围的左上角和右下角
//	var o_gps = point_pairs[back_data[5]];
//	var d_gps = point_pairs[back_data[6]];
//	//
//	console.log("point_pairs",point_pairs);
//	console.log(o_gps,d_gps);
//	//	alert(a);
//	var len = 2; //点的数量
//	var x = new Array(); //点的经度
//	
//	var y = new Array(); //点的纬度
//	x[0] = (o_gps[0][1]+o_gps[1][1])/2;
//	x[1] = (d_gps[0][1]+d_gps[1][1])/2;
//	y[0] = (o_gps[0][0]+d_gps[1][0])/2;
//	y[1] = (d_gps[0][0]+d_gps[1][0])/2;
//	console.log(x[0],x[1],y[0],y[1]);
//	//	for (i = 0; i < len; i++) {
//	//		y[i] = result["idx_gps"][i][0];
//	//	}
//	//	var maps = result["sum_matrix"];
//	var maps = [
//		["O点", front_data[0] + "  " + front_data[1] + "  " + front_data[2]],
//		[0, "D点"]
//	];
//	var value = new Array();
//	for (i = 0; i < len; i++) {
//		value[i] = maps[i][i];
//		//		value[i] = 233;
//	}
//
//	//	$("#final_image").hide();
//	//	$("#chart_1").addClass("div_method8")
//	$('#chart_freq_show').width($('#chart_freq_show').width());
//	$('#chart_freq_show').height($('#chart_freq_show').height());
//	var dom = document.getElementById("chart_freq_show");
////	alert(a);
//	var myChart = echarts.init(dom);
//	myChart.clear();
//
//	option = {
//		tooltip: {
//			trigger: 'item',
//			show: true,
//
//		},
//		title:{
//			text:(function(){
//				return '星期:'+front_data[0]+'\n时间:'+front_data[1]+'\n天气:'+front_data[2]+'\nO点POI:'+back_data[3]+'\nD点POI:'+back_data[4];
//			})()
////			backgroundColor:"rgba(0, 0, 0)",
////			borderColor:"#FFF"
//		},
//		bmap: {
//			center: [104.1, 30.68],
//			zoom: 12,
//			roam: true,
//
//		},
//		series: [{
//			type: 'graph',
//			layout: 'none', //使用x，y作为位置
//			legendHoverLink: true,
//			coordinateSystem: 'bmap',
//			roam: true, //可缩放和平移漫游
//			focusNodeAdjacency: true, //选取某节点时高亮相邻的边和节点
//			symbol: "circle", //节点形状
//			symbolSize: 40,
//			data: (function () {
//				var t = [];
//				for (var i = 1; i <= len; i++) {
//					var tmp = {
//						number: 'No' + i,
//						fax: value[i - 1],
//						name: 'No' + i,
//						value: [x[i - 1], y[i - 1], value[i - 1]],
//						itemStyle: {
//							color: (function () {
//								var colorList = ['#EE1289', '#DC143C', '	#E066FF', '#FF1493', '#FF6347', '#FF0000', '#B23AEE', '#BA55D3', '#C71585', '#9B30FF', '#969696', '#8E388E', '#8B008B', '#7D9EC0', '#7A7A7A', '#7A67EE', '#696969', '#515151', '#404040', '#12121', '#191970', '#00CD66', '#0000EE', '#00CDCD', '#7D26CD', '#71C671', '#76EE00', '#87CEFA', '#698B22', '#7171C6', '#ADADAD', '#DEB887'];
//								return colorList[Math.floor(Math.random() * colorList.length)];
//							})()
//
//						},
//						label: { //节点显示的标识
//							normal: {
//								show: true,
//								formatter: (function () {
//									return maps[i - 1][i - 1] + "";
//								})()
//							}
//						},
//						tooltip: {
//							formatter: (function () {
//								var str = '(' + y[i - 1] + ',' + x[i - 1] + ')';
//								var spoi;
//								var spoint;
//								if (i == 1) {
//									spoi = back_data[3];
//									spoint = "O点";
//								} else if (i == 2) {
//									spoi = back_data[4];
//									spoint = "D点";
//								}
//								return spoint + " " + spoi + ' (' + y[i - 1] + ',' + x[i - 1] + ')';
//							})(),
//							textStyle: {
//								fontFamily: 'Verdana, sans-serif',
//								fontSize: 15,
//								fontWeight: 'bold'
//							}
//						}
//					}
//					t.push(tmp);
//				}
//				return t;
//			})(),
//			// links: [],
//			links: (function () {
//				var t = [];
//
//				for (var i = 0; i < len; i++) {
//					for (var j = 0; j < len; j++) {
//						if (maps[i][j] != 0 && i != j) {
//							var tmp = {
//								source: i,
//								target: j,
//								value: maps[i][j],
//								symbolSize: [0.1, 10],
//								symbol: ['none', 'arrow'],
//								lineStyle: {
//									normal: {
//										width: 4,
//										color: 'source',
//									},
//									emphasis: {
//										width: 5
//									}
//
//								},
//								label: {
//									normal: {
//										show: true,
//										position: 'middle',
//										fontSize: 15,
//										formatter: ' {@value}'
//									},
//									emphasis: {
//										show: true
//									}
//								}
//							}
//							t.push(tmp);
//						}
//					}
//				}
//				return t;
//			})()
//		}]
//	};
//
//	myChart.setOption(option, true);
//	$("body,html").scrollTop(600);
//}
