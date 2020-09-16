$(function () {

// 基于准备好的dom容器，初始化echarts实例，myChart为此容器中的echarts实例
var myChart = echarts.init(document.getElementById('main'));

//在项目中此时的json数据应为访问服务器端动态获取到的数据
$.get('roomSale/loadRoomSale').done(function (data) { //data函数回调得到的json数据
    myChart.setOption({
        title: {
            text: '客房销售记录分析'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {  //工具
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {  //柱状图的类型名称
             data:data.legend
        },
        xAxis: {  //横轴数据
             data: data.xAxis
        },
        yAxis: {},  //纵轴数据
        series: [{
             name: "销售记录",
             type: "bar",
             data: data.series
        }]
    });
});

})