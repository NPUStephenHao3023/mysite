/**
 * Created by 30947 on 2018/7/18.
 */
$(function(){
	chart1();

})
//绘制饼状图
function chart1(){
//	alert("hello!");
	var myChart = echarts.init($("#chart_1")[0]);

    option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}% "
        },
        legend: {
            orient : 'vertical',
            x : 'right',
            textStyle : {
                color : '#ffffff',

            },
            data:['公司企业','商务住宅','政府机构','餐饮服务','生活服务','交通设施服务','购物服务','汽车服务']
        },

        calculable : false,
        series : [
            {
                name:'地点类型',
                type:'pie',
                radius : ['40%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '20',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data:[
                    {value:1, name:'公司企业'},
                    {value:14, name:'商务住宅'},
                    {value:8, name:'政府机构'},
                    {value:8, name:'餐饮服务'},
                    {value:47, name:'生活服务'},
                    {value:2, name:'交通设施服务'},
                    {value:2, name:'购物服务'},
                    {value:18, name:'汽车服务'}, 

                ]
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', function () {myChart.resize();});
}
