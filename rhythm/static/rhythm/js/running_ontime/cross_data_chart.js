// JavaScript Document
function show_chart_1(pattern) { //第一种情况，两个
	//	console.log(pattern);
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length;
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	if (flag == false) {
		alert("无效规则");
	}
	if (fieldFlags[5] == false || fieldFlags[6] == false) {
		alert("无效规则");
	}

	//OD点
	var tmpnode = creatnode_withshadow("No.1", "#CCFF99", 'O点\n区域' + fieldData[5], 300, 300,"#FFFF99");
	data.push(tmpnode);
	tmpnode = creatnode_withshadow('No.2', "#CCFF99", "D点\n区域" + fieldData[6], 800, 300,"#FFFF99");
	data.push(tmpnode);

	//时间
	if (fieldFlags[0] == true) {
		tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 550, 100);
		data.push(tmpnode);
	}
	if (fieldFlags[1] == true) {
		tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 750, 100);
		data.push(tmpnode);
	}

	//天气
	if (fieldFlags[2] == true) {
		tmpnode = creatnode('No.5', "#FFCC99", fieldData[2], 350, 100);
		data.push(tmpnode);
	}
	//POI
	if (fieldFlags[4] == true) {
		tmpnode = creatnode('No.6', "#FF9999", "D点POI\n" + fieldData[4], 700, 500);
		data.push(tmpnode);
	}
	if (fieldFlags[3] == true) {
		tmpnode = creatnode('No.7', "#FF9999", "O点POI\n" + fieldData[3], 400, 500);
		data.push(tmpnode);
	}
	//路段
	var X = [430, 560, 690];
	if (fieldFlags[7] == true) {
		for (var i = 0; i < roadLength; i++) {
			tmpnode = creatnode_withshadow('No.' + (8 + i), "#66FFB3", roadData[i] + " ", X[i], 300,"#FFFF99");
			data.push(tmpnode);
		}
	}

	//边
	//时间
	if (fieldFlags[0] == true) {
		tmplink = creatline('No.3', 'No.1');
		links.push(tmplink);
	}
	if (fieldFlags[1] == true) {
		tmplink = creatline('No.4', 'No.1');
		links.push(tmplink);
	}
	//天气
	if (fieldFlags[2] == true) {
		tmplink = creatline("No.5", "No.1");
		links.push(tmplink);
	}
	//POI
	if (fieldFlags[4] == true) {
		tmplink = creatline("No.6", "No.2");
		links.push(tmplink);
	}
	if (fieldFlags[3] == true) {
		tmplink = creatline("No.7", "No.1");
		links.push(tmplink);
	}
	//路段
	if (roadLength == 1) {
		tmplink = creatline("No.1", "No.8");
		links.push(tmplink);
		tmplink = creatline("No.8", "No.2");
		links.push(tmplink);
	} else if (roadLength == 2) {
		tmplink = creatline("No.1", "No.8");
		links.push(tmplink);
		tmplink = creatline("No.8", "No.9");
		links.push(tmplink);
		tmplink = creatline("No.9", "No.2");
		links.push(tmplink);
	} else if (roadLength == 3) {
		tmplink = creatline("No.1", "No.8");
		links.push(tmplink);
		tmplink = creatline("No.8", "No.9");
		links.push(tmplink);
		tmplink = creatline("No.9", "No.10");
		links.push(tmplink);
		tmplink = creatline("No.10", "No.2");
		links.push(tmplink);
	}

	make_pattern_chart(data, links);

}
//第二种情况，只存在一个O点或D点
function show_chart_2(pattern) {
	console.log(pattern);
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length; //一定为空
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	var tmpnode;
	var odnode; //挖掘到的是O点还是D点
	var tmplink;
	//节点
	if (flag == false) {
		alert("error");
		return;
	}
	if (fieldFlags[5] == true && fieldFlags[6] == true) {
		alert("error");
		return;
	}
	//O点或D点
	if (fieldFlags[5] == true) {
		tmpnode = creatnode_withshadow("No.1", "#CCFF99", 'O点\n区域' + fieldData[5], 300, 300,"#FFFF99");
		data.push(tmpnode);
		odnode = 1;

	} else {
		tmpnode = creatnode_withshadow('No.2', "#CCFF99", "D点\n区域" + fieldData[6], 800, 300,"#FFFF99");
		data.push(tmpnode);
		odnode = 2;
	}
	//时间
	if (fieldFlags[0] == true) {
		tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 550, 100);
		data.push(tmpnode);
	}
	if (fieldFlags[1] == true) {
		tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 750, 100);
		data.push(tmpnode);
	}

	//天气
	if (fieldFlags[2] == true) {
		tmpnode = creatnode('No.5', "#FFCC99", fieldData[2], 350, 100);
		data.push(tmpnode);
	}
	//POI
	if (fieldFlags[4] == true && odnode == 2) {
		tmpnode = creatnode('No.6', "#FF9999", "D点POI\n" + fieldData[4], 700, 500);
		data.push(tmpnode);
	}
	if (fieldFlags[3] == true && odnode == 1) {
		tmpnode = creatnode('No.7', "#FF9999", "O点POI\n" + fieldData[3], 400, 500);
		data.push(tmpnode);
	}
	//边
	//时间
	if (fieldFlags[0] == true) {
		if (odnode == 1) {
			tmplink = creatline('No.3', 'No.1');
		} else {
			tmplink = creatline('No.3', 'No.2');
		}
		links.push(tmplink);
	}
	if (fieldFlags[1] == true) {
		if (odnode == 1) {
			tmplink = creatline('No.4', 'No.1');
		} else {
			tmplink = creatline('No.4', 'No.2');
		}
		links.push(tmplink);
	}
	//天气
	if (fieldFlags[2] == true) {
		if (odnode == 1) {
			tmplink = creatline("No.5", "No.1");
		} else {
			tmplink = creatline("No.5", "No.2");
		}
		links.push(tmplink);
	}
	//POI
	if (fieldFlags[4] == true) {
		tmplink = creatline("No.6", "No.2");
		links.push(tmplink);
	}
	if (fieldFlags[3] == true) {
		tmplink = creatline("No.7", "No.1");
		links.push(tmplink);
	}
	make_pattern_chart(data, links);
}
//第三种情况，没有OD点和轨迹，但有两个POI
function show_chart_3(pattern) {
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length;
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	if (flag == false) {
		alert("无效规则");
		return;
	}
	if (fieldFlags[3] == false || fieldFlags[4] == false) {
		alert("无效规则");
		return;
		return;
	}

	//POI点
	var tmpnode = creatnode('No.6', "#FF9999", "D点POI\n" + fieldData[4], 700, 500);
	data.push(tmpnode);
	tmpnode = creatnode('No.7', "#FF9999", "O点POI\n" + fieldData[3], 400, 500);
	data.push(tmpnode);
	//时间
	if (fieldFlags[0] == true) {
		tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 550, 100);
		data.push(tmpnode);
	}
	if (fieldFlags[1] == true) {
		tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 750, 100);
		data.push(tmpnode);
	}

	//天气
	if (fieldFlags[2] == true) {
		tmpnode = creatnode('No.5', "#FFCC99", fieldData[2], 350, 100);
		data.push(tmpnode);
	}

	//边
	//时间
	if (fieldFlags[0] == true) {
		tmplink = creatline('No.3', 'No.7');
		links.push(tmplink);
	}
	if (fieldFlags[1] == true) {
		tmplink = creatline('No.4', 'No.7');
		links.push(tmplink);
	}
	//天气
	if (fieldFlags[2] == true) {
		tmplink = creatline("No.5", "No.7");
		links.push(tmplink);
	}
	//poi
	tmplink = creatline("No.7", "No.6");
	links.push(tmplink);

	make_pattern_chart(data, links);
}

function make_pattern_chart(data, links) {
	$('#chart_freq_show').width($('#chart_freq_show').width());
	$('#chart_freq_show').height($('#chart_freq_show').height());
	var dom = document.getElementById("chart_freq_show");
	//	alert(a);
	var myChart = echarts.init(dom);
	myChart.clear();

	option = {
		//		title: {
		//			text: 'Graph 简单示例'
		//		},
		tooltip: {},
		animationDurationUpdate: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [{
			type: 'graph',
			layout: 'none',
			symbolSize: 70,
			roam: true,
			label: {
				show: true
			},
			edgeSymbol: ['circle', 'arrow'],
			edgeSymbolSize: [4, 10],
			edgeLabel: {
				fontSize: 25
			},
			data: data,
			links: links,
			lineStyle: {
				opacity: 0.9,
				width: 2,
				curveness: 0
			}
		}]
	};;

	myChart.setOption(option, true);
}
//第四种情况，没有OD点，只有一个POI
function show_chart_4(pattern) {
	console.log(pattern);
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length; //一定为空
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	var tmpnode;
	var odnode; //挖掘到的是O点还是D点
	var tmplink;
	//节点
	if (flag == false) {
		alert("error");
		return;
	}
	if (fieldFlags[3] == true && fieldFlags[4] == true) {
		alert("error");
		return;
	}
	//O点POI或D点POI
	if (fieldFlags[4] == true) {
		tmpnode = creatnode('No.6', "#FF9999", "D点POI\n" + fieldData[4], 700, 500);
		data.push(tmpnode);
		odnode = 6;

	} else {
		tmpnode = creatnode('No.7', "#FF9999", "O点POI\n" + fieldData[3], 400, 500);
		data.push(tmpnode);
		odnode = 7;
	}
	//时间
	if (fieldFlags[0] == true) {
		tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 550, 100);
		data.push(tmpnode);
	}
	if (fieldFlags[1] == true) {
		tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 750, 100);
		data.push(tmpnode);
	}

	//天气
	if (fieldFlags[2] == true) {
		tmpnode = creatnode('No.5', "#FFCC99", fieldData[2], 350, 100);
		data.push(tmpnode);
	}

	//边
	//时间
	if (fieldFlags[0] == true) {
		if (odnode == 6) {
			tmplink = creatline('No.3', 'No.6');
		} else {
			tmplink = creatline('No.3', 'No.7');
		}
		links.push(tmplink);
	}
	if (fieldFlags[1] == true) {
		if (odnode == 6) {
			tmplink = creatline('No.4', 'No.6');
		} else {
			tmplink = creatline('No.4', 'No.7');
		}
		links.push(tmplink);
	}
	//天气
	if (fieldFlags[2] == true) {
		if (odnode == 6) {
			tmplink = creatline("No.5", "No.6");
		} else {
			tmplink = creatline("No.5", "No.7");
		}
		links.push(tmplink);
	}

	make_pattern_chart(data, links);
}
//第5种情况，没有OD点，和POI，但是有天气
function show_chart_5(pattern) {
	console.log(pattern);
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length; //一定为空
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	var tmpnode;
	var odnode; //挖掘到的是O点还是D点
	var tmplink;
	//节点
	if (flag == false) {
		alert("error");
		return;
	}
	if (fieldFlags[2] == false) {
		alert("失效规则");
		return;
	}

	//天气

	tmpnode = creatnode('No.5', "#FFCC99", fieldData[2], 300, 300);
	data.push(tmpnode);

	//时间
	if (fieldFlags[0] == true) {
		tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 100, 100);
		data.push(tmpnode);
	}
	if (fieldFlags[1] == true) {
		tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 500, 100);
		data.push(tmpnode);
	}

	//边
	//时间
	if (fieldFlags[0] == true) {
		tmplink = creatline('No.3', 'No.5');
		links.push(tmplink);
	}
	if (fieldFlags[1] == true) {
		tmplink = creatline('No.4', 'No.5');
		links.push(tmplink);
	}

	make_pattern_chart(data, links);
}
//第6种情况，只有时间
function show_chart_6(pattern) {
	console.log(pattern);
	//数据处理
	//0week,1time,2weather,3o_poi,4d_poi,5o_num,6d_num,7road
	var fieldFlags = pattern.fieldFlags;
	var roadData = pattern.roadData;
	var roadLength = roadData.length; //一定为空
	var fieldData = pattern.Data;
	var flag = pattern.flage;
	var data = [];
	var links = [];
	var tmpnode;
	var odnode; //挖掘到的是O点还是D点
	var tmplink;
	//节点
	if (flag == false) {
		alert("error");
		return;
	}
//	if (fieldFlags[0] == false || fieldFlags[1] == false) {
//		alert("失效规则");
//		return;
//	}


	//时间
	tmpnode = creatnode('No.3', "#66B2FF", fieldData[0], 100, 100);
	data.push(tmpnode);
	tmpnode = creatnode('No.4', "#FF99FF", fieldData[1], 500, 100);
	data.push(tmpnode);

	//边
	//时间

	tmplink = creatline('No.3', 'No.4');
	links.push(tmplink);


	make_pattern_chart(data, links);
}

function creatline(s, t) {
	return {
		source: s,
		target: t
	};
}

function creatnode(nodeName, nodeColor, nodeLabel, nodeX, nodeY) {
	var tmpnode = {
		name: nodeName,
		x: nodeX,
		y: nodeY,
		itemStyle: {
			color: nodeColor, //酸橙绿
			borderColor: '#000000',
			borderwidth: 4
		},
		label: {
			color: "#000000",
			show: true,
			formatter: (function () {
				return nodeLabel;
			})()
		}
	};
	return tmpnode;
}
function creatnode_withshadow(nodeName, nodeColor, nodeLabel, nodeX, nodeY,shadowcolor) {
	var tmpnode = {
		name: nodeName,
		x: nodeX,
		y: nodeY,
		itemStyle: {
			color: nodeColor, //酸橙绿
			borderColor: '#000000',
			borderwidth: 4,
			shadowColor: shadowcolor,
			shadowBlur: 25
		},
		label: {
			color: "#000000",
			show: true,
			formatter: (function () {
				return nodeLabel;
			})()
		}
	};
	return tmpnode;
}
