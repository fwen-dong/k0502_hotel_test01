layui.use(['jquery','table','layer','form','laydate'], function() {
    var $ = layui.jquery  //引用jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table    //引用table数据表格模块
        , form = layui.form //引用form模块
        , laydate = layui.laydate;  //引用日期模块

    loadPageOrders()  //初始化订单数据

    //定义查询的条件
    var selJsonOrders={};

    //全局的当前页，初始值为1
    var currentPage = 1;

    //日期时间范围选择
    laydate.render({
        elem: '#test3'
        ,type: 'datetime'
        ,format: 'yyyy/MM/dd HH:mm:ss'
        ,range: true //或 range: '~' 来自定义分割字符
    });

    function loadPageOrders(selJsonOrders) {//使用function的自定义函数需要调用才能执行
        //表格的分页加载，数据表格方法级渲染
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            , height: 412   //容器高度
            , where: selJsonOrders //异步数据接口的额外参数，要查询的条件参数（格式为JSON）
            , limit: 3   //每一页显示的数据条数，默认值为10
            , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
            , url: 'orders/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            , toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print']
            , even: true  //每一行有渐变效果
            , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            , cols: [[ //表头
                //加入复选框列
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', align: 'center', width: 80, sort: true}
                , {field: 'orderNum', title: '订单编号' , align: 'center', width: 180}
                , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true,templet: '<div>{{d.inRoomInfo.customerName}}</div>'}
                , {field: 'idcard', title: '身份证号', align: 'center', width: 210,templet: '<div>{{d.inRoomInfo.idcard}}</div>'}
                , {field: 'isVip', title: 'vip', align: 'center', width: 100,templet: '#isVipTpl'}
                , {field: 'phone', title: '手机号', align: 'center', width: 180, sort: true,templet: '<div>{{d.inRoomInfo.phone}}</div>'}
                , {field: 'createDate', title: '下单时间', align: 'center', width: 240, sort: true}
                , {field: 'orderMoney', title: '总价',align: 'center', width: 140, sort: true}
                , {field: 'remark', title: '备注',align: 'center', width: 280, sort: true}
                , {field: 'orderStatus', title: '状态',align: 'center', width: 120, sort: true,templet:'#orderStatusTpl'}
                , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 180}
            ]],
            done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
                currentPage=curr; //将分页时的当前页赋值给全局变量
            }
        });
    }



    //根据条件查询订单数据,提交监听表单
    form.on('submit(demo1)', function (data) {
        selJsonOrders = {};  //进到查询来重新为空
        if(data.field.queryTimes!=""){  //时间范围有选择,将时间进行切割(设置时间合适为“-”)
            var arrTimes = data.field.queryTimes.split("-");
            selJsonOrders['minDate'] = arrTimes[0];
            selJsonOrders['maxDate'] = arrTimes[1];
            delete data.field.queryTimes
        }
        selJsonOrders['orderNum'] = data.field.orderNum;
        selJsonOrders['orderStatus'] = data.field.orderStatus;
        loadPageOrders(selJsonOrders);
        return false;  //阻止表单跳转提交
    });


    //表格的工具条的监听
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if (layEvent === 'del') { //删除
            layer.confirm('真的删除此订单信息吗？', function (index) {
                //向服务端发送删除指令
                updOrdersFlag(obj);
                layer.close(index);  //关闭当前的询问框
            });
        } else if (layEvent === 'payUI') { //支付
            layer.confirm('真的要支付此订单吗？', function (index) {
                window.open("model/toOrdersPay?orderNum="+data.orderNum+"&orderMoney="+data.orderMoney);
                layer.close(index);  //关闭当前的询问框
            });
        }
    });


    //修改订单显示状态(“删除”)
    function updOrdersFlag(obj) {
        $.ajax({
            type:'POST',
            url:'orders/updByPrimaryKeySelective',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"id":obj.data.id,"flag":"0"},
            success:function (data) {
                if(data=='success'){
                    layer.msg("入住信息删除成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                }else {
                    layer.msg("入住信息删除失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }


    //头部工具栏事件-批量删除（修改显示状态）
    table.on('toolbar(test)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
            case 'delBatchOrders':
                var data = checkStatus.data;//获取选中行的数据，对象数组
                if(data.length!=0) {  //判断有选中数据
                    var checkDelIf = true;  //判断选中的数据是否可以删除的变量
                    var ids = '';  //要删除的ids
                    for (var i = 0; i < data.length; i++) { //循环拼接要被删除的订单id
                        if(data[i].orderStatus=='0') {  ////判断选中的此条订单数据是否支付，未支付，不能删
                            checkDelIf = false;//将判断是否删除的变量赋值为false
                            break;  ////跳出循环，结束拼接操作，已经不能删除
                        }else { //已支付，删除
                            ids += data[i].id + ","; //拼接订单的id
                        }
                    }
                    //根据checkDelIf判断是否执行批量删除
                    if(checkDelIf){
                        layer.confirm('真的删除选中的订单吗？', function (index) {
                            ids = ids.substring(0,ids.length-1);  //去掉最后一个逗号
                            //执行批量删除（修改显示状态）
                            updBatchOrdersFlag(ids);
                            layer.close(index);  //关闭当前的询问框
                        });
                    }else {
                        layer.msg("你选中的数据有未支付的！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
                    }
                }else {
                    layer.msg("你还未选中删除的数据！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
                }
                break;
            };
    });


    //执行批量删除（修改显示状态）
    function updBatchOrdersFlag(ids){
        $.ajax({
            type:'POST',
            url:'orders/updBatchByPrimaryKeySelective', //调用的是base系列的方法，只需要改mapper.xml文件
            data:{"ids":ids,"flag":"0"}, //自动传回服务器端 (json格式数组)
            success:function (data) { //请求路径正确时的函数回调，data为响应回来的JSON数据
                if (data=="success") {
                    layer.msg("订单批量删除成功。。", {icon: 1,time:2000,anim: 4,shade:0.5})
                    //重新加载员工数据，停留在当前页的条件查询(数据表格重载)
                    table.reload('demo', {  //demo为table表格容器id
                        page: {   //查询条件
                            curr: currentPage ////重新从第 currentPage(当前页) 页开始
                        }
                    }); //只重载数据，异步加载表格数据
                }else {
                    layer.msg("订单批量删除失败！！", {icon: 2,time:2000,anim: 3,shade:0.5})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})