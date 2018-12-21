/**
 * Created by 30947 on 2018/7/20.
 */
//$(function(){
////    getHt();
////    table();
//
//})
var label1 = "";
var week = false;
var weather = false;
var point_o = false;
var point_d = false;
var point_o_poi = false;
var point_d_poi = false;
var sum_xvlie = 0;
//清空



function clear_it(id) {
	if (id.id == "clear") {
		week = false;
		weather = false;
		point_o = false;
		point_d = false;
		point_o_poi = false;
		point_d_poi = false;
		label1 = "";
		sum_xvlie = 0;
		document.getElementById("label1").innerHTML = "请选择顺序";
		var options = document.getElementById("sq_pinfan").children;
		options[0].selected=true;
		document.getElementById("label2").innerHTML = "0.1";
		var options = document.getElementById("sq_xvlie").children;
		options[0].selected=true;
		document.getElementById("label3").innerHTML = "20";
	}
}

//点击顺序按钮
function changetext(id) {
//	var user =    
//    {    
//    "username":"andy",    
//    "age":20,    
//    "info": { "tel": "123456", "cellphone": "98765"}   
//    }    
	if (id.id == "week") {
		if (week == false) {
			label1 += "星期->"
			document.getElementById("label1").innerHTML = label1;
			week = true;
			sum_xvlie++;
		}
	} else if (id.id == "weather") {
		if (weather == false) {
			label1 += "天气->"
			document.getElementById("label1").innerHTML = label1;
			weather = true;
			sum_xvlie++;
		}
	} else if (id.id == "point_o") {
		if (point_o == false) {
			label1 += "O点->"
			document.getElementById("label1").innerHTML = label1;
			point_o = true;
			sum_xvlie++;
		}
	} else if (id.id == "point_d") {
		if (point_d == false) {
			label1 += "D点->"
			document.getElementById("label1").innerHTML = label1;
			point_d = true;
			sum_xvlie++;
		}
	} else if (id.id == "point_o_poi") {
		if (point_o_poi == false) {
			label1 += "O_poi->"
			document.getElementById("label1").innerHTML = label1;
			point_o_poi = true;
			sum_xvlie++;
		}
	} else if (id.id == "point_d_poi") {
		if (point_d_poi == false) {
			label1 += "D_poi->"
			document.getElementById("label1").innerHTML = label1;
			point_d_poi = true;
			sum_xvlie++;
		}
	}


}

//选择支持量
function btnChange(id, values) {
	//	alert(values);
	if (id.id == "sq_pinfan") {
		document.getElementById("label2").innerHTML = values;
	} else if (id.id == "sq_xvlie") {
		document.getElementById("label3").innerHTML = values;
	}
}

//点击提交按钮
function run_it(id) {
	if (id.id == "run_pinfan") {
		//至少选择两个顺序.
		if (sum_xvlie >= 2) {
			// js 获取form表单
			var form_submit = document.getElementById("form_pinfan");
			// 动态给form表单设置请求位置
			//		form_submit.active = "http://www.daxuehua.cn";
			// 让form表单提交

			var tmpInput = $("<input type='text' name='xvlie'/>");
			tmpInput.attr("value", label1);

			form_submit.append(tmpInput);
			//		alert("hjkjlh");
			form_submit.submit();
			alert("here!");
		}else{
			alert("请至少选择两个顺序！");
		}
	}
}
