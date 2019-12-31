var url={
    /*
    *  后台的技术  java  jdbc
    *            php
    *            python
    *            nodejs
    *            .net
    *            散列式  hash表   json格式
    *
    *
    *
    *
    * */
    hourly: "http://123.56.160.241/index.php/index/index/getHourlyData",  //取小时
    daily: "http://123.56.160.241/index.php/index/index/getDailyData",  // 取天的
    season: "http://123.56.160.241/index.php/index/index/getSeasonData",  //季度
    age: "http://123.56.160.241/index.php/index/index/getAgeData", //年龄
    step: "http://123.56.160.241/index.php/index/index/getStepData",  //漏斗图
    area: "http://123.56.160.241/index.php/index/index/getAreaData"   //地图数据
};
var setZero=function (v) {
    return v < 10 ? "0" + v : v;
};
var obj={
    //获取时间
    getTime(){
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth() + 1;
        var day=date.getDate();
        var week=date.getDay();
        var hour=date.getHours();
        var minute=date.getMinutes();
        setInterval(function () {
            var date=new Date();
            var setZero=function (v) {
                return v < 10 ? "0" + v : v;
            };
            var hour=date.getHours();
            var minute=date.getMinutes();
            $(".time>span").html(setZero(hour) + ":" + setZero(minute));
        }, 60000);
        $(".time>span").html(setZero(hour) + ":" + setZero(minute));
        $(".week").html(function () {
            switch (week) {
                case 0:
                    return "星期日";
                case 1:
                    return "星期一";
                case 2:
                    return "星期二";
                case 3:
                    return "星期三";
                case 4:
                    return "星期四";
                case 5:
                    return "星期五";
                case 6:
                    return "星期六";
            }
        });
        $(".today").html(year + "-" + month + "-" + day);
        return this;
    },
    //获取天气
    getWeather(){
        $.ajax({
            url: "https://free-api.heweather.net/s6/weather/now",
            data: {
                key: "a1648482f6af4765ac2ef57d7aabde8d",
                location: "太原"
            },
            success: function (res) {
                var code = res.HeWeather6[0].now.cond_code;
                $(".icon-weather").addClass("iconfont icon-"+code);
            }
        });
        return this;
    },
    //小时访问量
    showHourly: function (month="01", day="01") {
        $.ajax({
            url: url.hourly,
            data: {
                month: month,
                day: day
            },
            success: function (res) {
                if (res.code === 200) {
                    var resData=res.data;
                    var data=[];
                    var dataAxis=[];
                    for (var i=0; i < resData.length; i++) {
                        dataAxis.push(resData[i].hour);
                        data.push(resData[i].pvs);
                    }
                    var option={
                        grid: {
                            x: 40,
                            y: 20,
                            x2: 0,
                            y2: 20
                        },
                        xAxis: {
                            data: dataAxis,  //x轴文字内容
                            axisLabel: {   //坐标轴刻度标签设置
                                inside: true, //刻度标签是否朝内
                                textStyle: {  //文字样式
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                show: false  //是否显示坐标轴刻度
                            },
                            axisLine: {
                                show: false //是否显示坐标轴线
                            },
                            z: 2
                        },
                        yAxis: {
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                align: "left",
                                margin: 40,
                                textStyle: {
                                    color: '#fff',
                                }
                            },
                            splitLine: {  //分割线样式
                                show: true,
                                lineStyle: {
                                    color: "#1a1e34"
                                }
                            }
                        },
                        dataZoom: [
                            {
                                type: 'inside'  //区域缩放
                            }
                        ],
                        series: [
                            {
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: 0, color: '#306beb'},
                                                {offset: 1, color: '#3ccefa'}
                                            ]
                                        ),
                                        barBorderRadius: [5, 5, 0, 0]
                                    }
                                },
                                data: data
                            }
                        ]
                    };
                    var myChart=echarts.init($(".chart1")[0]);

                    // // 缩放设置
                    // var zoomSize=4;
                    // myChart.on('click', function (params) {
                    //     myChart.dispatchAction({
                    //         type: 'dataZoom',
                    //         startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    //         endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                    //     });
                    // });
                    myChart.setOption(option);
                }
            }
        });
        return this;
    },
    //中间地图
    showMap: function () {
        $.ajax({
            url: url.area,
            success: function (res) {
                if (res.code === 200) {
                    var data=res.data;
                    var mapData=data.map(function (v) {
                        return {
                            name: v.province,
                            value: [v.longitude, v.latitude, v.pvs]
                        }
                    });
                    var option={
                        tooltip: {
                            trigger: 'item',
                            //提示框位置
                            position: function (point) {
                                return [point[0] + 30, point[1] - 30];
                            },
                            //提示框内容格式
                            formatter: function (params) {
                                return params.data.name + "<br>访问量： " + params.data.value[2]
                            },
                            backgroundColor: "rgba(63, 236, 255, 0.25)",
                            borderColor: "#3cd3fb",
                            borderWidth: "1"
                        },
                        geo: {
                            map: 'china',
                            layoutCenter: ['50%', '50%'],
                            layoutSize: 450, //尺寸
                            itemStyle: {
                                normal: {
                                    areaColor: '#4294cb',
                                    borderColor: '#111'
                                },
                                emphasis: {
                                    areaColor: '#46f0ff'
                                }
                            }
                        },
                        series: [
                            {
                                type: 'effectScatter',
                                coordinateSystem: 'geo',
                                rippleEffect: { //涟漪特效
                                    period: 4, //动画时间，值越小速度越快
                                    brushType: 'fill', //波纹绘制方式 stroke, fill
                                    scale: 3 //波纹圆环最大限制，值越大波纹越大
                                },
                                data: mapData,
                                symbol: 'circle',
                                symbolSize: function (val) {
                                    return val[2]/800;
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#fff',
                                    }
                                }
                            }
                        ]
                    };
                    var mapChart=echarts.init($('.map')[0]);
                    mapChart.setOption(option);
                }
            }
        });

        return this;
    },
    //数据显示
    showData: function () {
        $.ajax({
            url: url.step,
            success: function (res) {
                "use strict";
                if (res.code === 200) {
                    var data=res.data;
                    var option={
                        color: ["#3fecff", "#4c63f2", "#95aaff", "#ffac6d"],
                        series: [
                            {
                                type: 'funnel',
                                top: 0,
                                left: '45%',
                                width: '40%',
                                gap: 16,
                                minSize: 70,
                                maxSize: 210,
                                label: {
                                    normal: {
                                        color: '#fff',
                                        position: 'left',
                                        padding: [11, 25, 11, 25],
                                        width: 50,
                                        formatter: "{b|{b}}\n{c|{c}}",
                                        rich: {
                                            b: {
                                                width: 14,
                                                height: 9,
                                                align: 'center',
                                                padding: 5,
                                                fontSize: 14,
                                                color: "#fff"
                                            },
                                            c: {
                                                width: 14,
                                                height: 9,
                                                align: 'center',
                                                padding: 5,
                                                fontSize: 14,
                                            }
                                        }
                                    }
                                },
                                //左侧的百分比显示的地方
                                labelLine: {
                                    show: true,
                                    normal: {
                                        length: 50,
                                        position: 'left',
                                        lineStyle: {
                                            width: 1,
                                            color: '#e8e9f1',
                                            type: 'solid'
                                        },
                                    },

                                },
                                data: [
                                    {value: data[0].pvs, name: data[0].step},
                                    {value: data[1].pvs, name: data[1].step},
                                    {value: data[2].pvs, name: data[2].step},
                                    {value: data[3].pvs, name: data[3].step}
                                ]
                            },
                        ]
                    };
                    var myChart=echarts.init($(".chart2")[0]);
                    myChart.setOption(option);
                }
            }
        });
        return this;
    },
    //日访问量
    showDaily: function (month="01") {
        $.ajax(
            {
                url: url.daily,
                data: {
                    month: month,
                },
                success: function (res) {
                    if (res.code === 200) {
                        var resData=res.data;
                        var myChart=echarts.init($(".chart3")[0]);
                        var dataAxis=[];
                        var data=[];
                        for (var i=0; i < resData.length; i++) {
                            dataAxis.push(resData[i].day);
                            data.push(resData[i].pvs);
                        }
                        var option={
                            grid: {
                                x: 40,
                                y: 20,
                                x2: 0,
                                y2: 20
                            },
                            xAxis: {
                                data: dataAxis,  //x轴文字内容
                                axisLabel: {   //坐标轴刻度标签设置
                                    inside: false, //刻度标签是否朝内
                                    textStyle: {  //文字样式
                                        color: '#fff'
                                    }
                                },
                                axisTick: {
                                    show: false  //是否显示坐标轴刻度
                                },
                                axisLine: {
                                    show: false //是否显示坐标轴线
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
                                    align: "left",
                                    margin: 40,
                                    textStyle: {
                                        color: '#fff',
                                    }
                                },
                                splitLine: {  //分割线样式
                                    show: true,
                                    lineStyle: {
                                        color: "#1a1e34"
                                    }
                                }
                            },
                            dataZoom: [
                                {
                                    type: 'inside'  //区域缩放
                                }
                            ],
                            series: [
                                {
                                    type: 'line',
                                    itemStyle: {
                                        color: '#ffad6a'
                                    },
                                    symbol: 'none',
                                    areaStyle: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: 'rgba(255,194,146,.3)'
                                        }, {
                                            offset: 1,
                                            color: 'rgb(255, 255, 255,0)'
                                        }])
                                    },
                                    data: data
                                }
                            ]
                        };

                        // 缩放设置
                        var zoomSize=6;
                        myChart.on('click', function (params) {
                            myChart.dispatchAction({
                                type: 'dataZoom',
                                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                            });
                        });
                        myChart.setOption(option);
                    }
                }
            }
        );
        return this;
    },
    //季访问量
    showSeason: function () {
        $.ajax({
            url: url.season,
            success: function (res) {
                if (res.code === 200) {
                    var total=res.data.reduce((a, b) => ({pvs: a.pvs * 1 + b.pvs * 1}));
                    var s1=res.data.slice(0, 3).reduce((a, b) => ({pvs: a.pvs * 1 + b.pvs * 1}));
                    var s2=res.data.slice(3, 6).reduce((a, b) => ({pvs: a.pvs * 1 + b.pvs * 1}));
                    var s3=res.data.slice(6, 9).reduce((a, b) => ({pvs: a.pvs * 1 + b.pvs * 1}));
                    var s4=res.data.slice(10,).reduce((a, b) => ({pvs: a.pvs * 1 + b.pvs * 1}));
                    var myChart=echarts.init($(".chart4")[0]);
                    var option={
                        grid: {
                            x: 40,
                            y: 20,
                            x2: 0,
                            y2: 20
                        },
                        title: {
                            text: total.pvs,
                            subtext: '用户总数',
                            left: 'center',
                            top: 'center',
                            textStyle: {
                                color: '#fff',
                                fontSize: 24,
                                fontFamily: 'SourceHanSansCN-Regular',
                            },
                            subtextStyle: {
                                color: '#fff',
                                fontSize: 12,
                                fontFamily: 'SourceHanSansCN-Regular',
                                top: 'center'
                            },
                            itemGap: 4 //主副标题间距
                        },
                        color: ["#3fecff", "#4c63f2", "#95aaff", "#ffac6d"],
                        series: [
                            {
                                type: 'pie',
                                radius: ['0', '35%'],
                                center: ['50%', '50%'],
                                itemStyle: {
                                    normal: {
                                        color: "#0d3550",
                                        label: {
                                            show: false
                                        },
                                        labelLine: {
                                            show: false
                                        }
                                    },
                                },
                                data: [100],
                            },
                            {
                                type: 'pie',
                                radius: ['40%', '60%'],
                                avoidLabelOverlap: true,
                                label: {
                                    normal: {
                                        formatter: '{b|{b}}\n{c|{c}}  {d|{d}%}',
                                        padding: [0, -100],
                                        rich: {
                                            b: {
                                                fontSize: 16,
                                                color: '#fff',
                                                align: 'center',
                                                verticalAlign: "top",
                                                padding: 4,
                                                lineHeight: 30
                                            },
                                            c: {
                                                fontSize: 18,
                                                align: 'left',
                                                color: '#ff4873'
                                            },
                                            d: {
                                                fontSize: 18,
                                                align: 'left',
                                                color: '#ff4873'
                                            }
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true,
                                        length: 30,
                                        length2: 100,
                                        lineStyle: {
                                            color: '#28b1c7',
                                            width: 2
                                        }
                                    }
                                },
                                data: [
                                    {value: s1.pvs, name: '第一季度'},
                                    {value: s2.pvs, name: '第二季度'},
                                    {value: s3.pvs, name: '第三季度'},
                                    {value: s4.pvs, name: '第四季度'},
                                ]
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            }
        });

        return this;
    },
    //按年龄划分
    showAge: function () {
        $.ajax({
            url: url.age,
            success: function (res) {
                if (res.code === 200) {
                    var data=res.data;
                    var myChart=echarts.init($(".chart5")[0]);
                    var option={
                        grid: {
                            x: 40,
                            y: 20,
                            x2: 0,
                            y2: 20
                        },
                        color: ["#3fecff", "#4c63f2", "#95aaff", "#ffac6d", "#ff5f67"],
                        series: [
                            {
                                type: 'pie',
                                radius: ['0', '60%'],
                                avoidLabelOverlap: true,
                                roseType: 'radius',
                                label: {
                                    normal: {
                                        formatter: '{b|{b}}{b|{d}%}',
                                        padding: [0, -100],
                                        height: 30,
                                        rich: {
                                            b: {
                                                fontSize: 14,
                                                color: '#fff',
                                                align: 'center',
                                            }
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: true,
                                        length: 30,
                                        length2: 80,
                                        lineStyle: {
                                            color: '#28b1c7',
                                            width: 2
                                        }
                                    }
                                },
                                data: [
                                    {value: data[0].pvs, name: '18岁以下'},
                                    {value: data[1].pvs, name: '18岁-25岁'},
                                    {value: data[2].pvs, name: '25岁-40岁'},
                                    {value: data[3].pvs, name: '40岁-60岁'},
                                    {value: data[4].pvs, name: '60岁以上'},
                                ]
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            }
        });
        return this;
    }
};
obj.getTime().getWeather().showHourly().showMap().showData().showDaily().showSeason().showAge();
laydate.render({
    elem: '#day', //指定元素
    value: '2018-01-01',
    min: '2018-1-1',
    max: '2018-12-31',
    done: function (value, date) {
        obj.showHourly(setZero(date.month), setZero(date.date));
    }
});
laydate.render({
    elem: '#month', //指定元素
    type: 'month',
    format: "yyyy-MM",
    value: '2018-01',
    min: "2018-01-01",
    max: '2018-12-31',
    done: function (value, date) {
        obj.showDaily(setZero(date.month));
    }
});
