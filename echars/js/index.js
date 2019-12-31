hours()
//处理小时
function hours(month,day) {

    var month=month?month:1;
    var day=day?day:1;

    $.ajax({
        url:"http://123.56.160.241/index.php/index/index/getHourlyData?month="+month+"&day="+day,
        success:function (e) {
            var dataAxis = [];
            var data = [];
            for(var i=0;i<e.data.length;i++){
                dataAxis.push(e.data[i].hour)
                data.push(e.data[i].pvs)
            }


            var yMax = 50;
            var dataShadow = [];

            for (var i = 0; i < data.length; i++) {
                dataShadow.push(yMax);
            }

            option = {
                title: {
                    text: '',
                    subtext: ''
                },
                grid:{
                    top:50,
                    bottom:10
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: '#333'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        barGap:'-100%',
                        barCategoryGap:'40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                ),
                                barBorderRadius: [5, 5, 0, 0]
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: data
                    }
                ]
            };


            var myChart = echarts.init(document.querySelector(".left-middle-box"));
            myChart.setOption(option);
// Enable data zoom when user click bar.
            var zoomSize = 6;
            myChart.on('click', function (params) {
                console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                myChart.dispatchAction({
                    type: 'dataZoom',
                    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                });
            });




        }
    })


}


//处理天
days()
function days(month) {
   var month= month?month:1
   $.ajax({
       url:"http://123.56.160.241/index.php/index/index/getDailyData?month="+month,
       success:function (e) {
           var datax=[];
           var datay=[];
           for(var i=0;i<e.data.length;i++){
               datax.push(e.data[i].day)
               datay.push(e.data[i].pvs)
           }

           var option = {
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: datax,
                   axisLabel: {
                       inside: false,
                       textStyle: {
                           color: '#aaa'
                       }
                   },
               },
               yAxis: {
                   type: 'value',
                   axisLabel: {
                       inside: false,
                       textStyle: {
                           color: '#aaa'
                       }
                   },
                   splitLine: {
                       lineStyle: {
                           // 使用深浅的间隔色
                           color: '#333'
                       }
                   }
               },
               series: [{
                   data: datay,
                   type: 'line',
                   lineStyle:{
                       color:"orange"
                   },
                   areaStyle: {
                       color: {
                           type: 'linear',
                           x: 0,
                           y: 0,
                           x2: 0,
                           y2: 1,
                           colorStops: [{
                               offset: 0, color: '#ccc' // 0% 处的颜色
                           }, {
                               offset: 1, color: '#000' // 100% 处的颜色
                           }],
                           global: false // 缺省为 false
                       }

                   }
               }]
           };

           var myChart = echarts.init(document.querySelector(".left-bottom-box"));
           myChart.setOption(option);



       }
   })
}

//处理季度
jidu()
function jidu() {
   $.ajax({
      url:"http://123.56.160.241/index.php/index/index/getSeasonData",
       success:function (e) {
           console.log(e.data);
           var datas=[];

           var obj={};
           obj.name="第一季度";
           obj.value=parseInt(e.data[0].pvs)+ parseInt(e.data[1].pvs)+ parseInt(e.data[2].pvs)
           datas.push(obj);

           var obj={};
           obj.name="第二季度";
           obj.value=parseInt(e.data[3].pvs)+ parseInt(e.data[4].pvs)+ parseInt(e.data[5].pvs)
           datas.push(obj);

           var obj={};
           obj.name="第三季度";
           obj.value=parseInt(e.data[6].pvs)+ parseInt(e.data[7].pvs)+ parseInt(e.data[8].pvs)
           datas.push(obj);

           var obj={};
           obj.name="第四季度";
           obj.value=parseInt(e.data[9].pvs)+ parseInt(e.data[10].pvs)+ parseInt(e.data[11].pvs)
           datas.push(obj);


           var option = {
               tooltip: {
                   trigger: 'item',
                   formatter: "{a} <br/>{b}: {c} ({d}%)"
               },
               color: ["#3fecff", "#4c63f2", "#95aaff", "#ffac6d"],
               series: [
                   {
                       name:'访问来源',
                       type:'pie',
                       radius: ['50%', '70%'],
                       center: ['50%', '50%'],
                       avoidLabelOverlap: true,
                       label: {
                           normal: {
                               show: false,
                               position: 'center'
                           },
                           emphasis: {
                               show: true,
                               textStyle: {
                                   fontSize: '30',
                                   fontWeight: 'bold'
                               }
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data:datas
                   }
               ]
           };


           var myChart = echarts.init(document.querySelector(".center-bottom-box"));
           myChart.setOption(option);


       }
   })
}

//设置日历
laydate.render({
    elem: '#day', //指定元素
    value: '2018-01-01',
    min: '2018-1-1',
    max: '2018-12-31',
    done: function (value, date) {
        hours(date.month, date.date);
    }
});

//设置月历
laydate.render({
    elem: '#month', //指定元素
    value: '2018-01',
    type: 'month',
    format: "yyyy-MM",
    min: "2018-01-01",
    max: '2018-12-31',
    done: function (value, date) {
       days(date.month);
    }
});