layui.use(['jquery','layer', 'element','form','laypage'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , element = layui.element  //引用element面板模块
        , form = layui.form  //引用form表单模块
        , laypage = layui.laypage;  //引用分页组件(分页插件)

    var page = 1;  //全局变量的当前页初始值为1

    var limit = 3;  //全局变量的每一页的数据条数初始值为3

    var count;  //全局变量总的数据条数

    var checkRoomsOfRoomTypeIf = false;  //验证房房型是否可删的判断


    var checkRoomTypeNameIf = false;   //验证房型名称唯一性判断

    //七牛云的存储空间的域名
    var qnyName = "http://qg8fvium4.hn-bkt.clouddn.com/";


    //初始化首页类型的数据(刷新页面时只会执行一次)
    loadPageRoomType();

    //初始化layui的分页
    loadPage()


    //自定义验证（提交表单时的验证，点击表单提交按钮时执行），验证的最后执行
    form.verify({  //做表单提交时的验证
        roomPrice: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(value<100||value>2000){
                return '房型的价格为100-2000之间！！';
            }
        },

        roomTypeName: function(value, item){ //value：表单的值、item：表单的DOM对象(标签对象)
            checkRoomTypeName(value)
            if (!checkRoomTypeNameIf){
                return '此房型名称已被使用！！';
            }
        }
    });


    //完整功能
    function loadPage(){
        laypage.render({  //此分页的数据加载均为异步加载
             elem: 'test1'  //分页标签容器
            ,count: count //分页时总的数据条数（重要）变量
            ,curr:page //分页的当前页的值,默认值1
            ,limit:limit  //每一页的数据条数，默认值为10，用于计算页数
            ,limits:[2,3,5,8,10,15,20]
            //分页标签展示的图表按钮  总条数  上一页  第几页  下一页   每一页数据条数  重载  跳转到第几页
            ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            ,jump: function(obj,first){  //执行分页时的函数回调，当点击上一页下一页等等时只会调用此函数（不会将此js代码整个至上而下执行），加载分页数据
                //刚进入页面，首次不执行,再次点击分页执行
                if(!first){
                    page = obj.curr;  //将分页的当前页的值赋值给全局变量当前页
                    limit = obj.limit;  //将分页的每一页的数据条数值赋值给全局变量每一页的数据条数
                    loadPageRoomType(); //执行房型的分页查询
                }

            }
        });
    }

    //加载第1页的房型数据，要得到总的数据条数（重要）
    function loadPageRoomType() {
        $.ajax({
            type:"post",
            url:"roomType/loadPageByPramas",
            async: false,
            data:{"page":page,"limit":limit},
            success:function (data) {
                count = data.count;  //将数据总的条数赋值给全局变量
                var roomTypeStr = '';
                $.each(data.data,function (i,roomType) {
                    roomTypeStr += '<div class="layui-colla-item" style="margin-top: 10px;">';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-danger" event="del" value="'+roomType.id+'" style="float: right;">删除</button>';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" event="upd" value="'+roomType.id+','+roomType.roomTypeName+','+roomType.roomPrice+'" style="float: right;">修改</button>';
                    roomTypeStr += '<h2 class="layui-colla-title" roomTypeId="'+roomType.id+'">'+roomType.roomTypeName+'--'+roomType.roomPrice+'元/天'+'</h2>';
                    roomTypeStr += '<div class="layui-colla-content">';
                    roomTypeStr += '<p id="p'+roomType.id+'"></p>';//循环每次获取的roomType.id不一样,避免id名重复
                    roomTypeStr += '</div>';
                    roomTypeStr += '</div>';
                })
                $("#collapseDiv").html(roomTypeStr);
                //将面板渲染
                element.render('collapse');
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }


    //做删除和修改操作
    $("#collapseDiv").on("click","button",function () {
        //取到判断进行操作的变量，$(this)表示当前选中的button
        var event = $(this).attr("event");
        if (event=='del') {
            var id = $(this).val();
            checkRoomsOfRoomType(id); //验证该房型下有没有客房数据，有则不能删除，否则可以删除
            if (checkRoomsOfRoomTypeIf) {
                layer.confirm('真的删除此房型数据吗？', function (index) {
                    delRoomTypeById(id);  //执行房型数据删除
                    layer.close(index);  //关闭当前的询问框
                });
            }else {  //有客房数据，不能删除
                layer.msg("有客房数据，不能删除！",{icon: 7,time: 2000,anim:6,shade:0.5})
            }
        }else {
            //1.form表单数据回显赋值
            var roomTypeArr = $(this).val().split(",");
            form.val("updRoomTypeFromFilter", { //formTest 即 class="layui-form"(表单) 所在元素属性 lay-filter="" (监听器)对应的值
                 "id": roomTypeArr[0]
                ,"roomTypeName": roomTypeArr[1]
                ,"roomPrice": roomTypeArr[2]
            });
            //2.弹框
            layer.open({
                type:1,  //弹出类型
                title:"房型修改操作界面",  //弹框标题
                area:['380px','280px'],  //弹框款高度
                anim: 4,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#updRoomTypeDiv")  //弹出的内容
            });
            //3.监听提交按钮,完成表单的修改
            form.on('submit(demo4)', function(data){
                updRoomType(data.field); //执行修改
                layer.closeAll(); //关闭当前页面中所有弹框
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }
    });


    //点击添加按钮
    $("#saveRoomTypeBtn").click(function () {
        //1.清空添加的表单
        $("form").eq(0).find("input").val("");
        //2.将添加界面弹出
        layer.open({
            type:1,  //弹出类型
            title:"房型添加操作界面",  //弹框标题
            area:['380px','280px'],  //弹框款高度
            anim: 3,  //弹出的动画效果
            shade:0.5,  //阴影遮罩
            content:$("#saveRoomTypeDiv")  //弹出的内容
        });
        //3.监听表单的添加按钮完成添加（监听submit的提交）
        form.on('submit(demo3)', function(data){
            saveRoomType(data.field); //执行添加
            layer.closeAll(); //关闭当前页面中所有弹框
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    })


    //监听折叠面板
    element.on('collapse(test)', function(data){
        if(data.show){  //面板展开时的操作
            var roomTypeId = $(this).attr("roomTypeId");//获取h2标签设置id值
            console.log(roomTypeId);
            //根据此房型id数据查询多个客房数据
            loadRoomsByRoomTypeId(roomTypeId);
        }
    });

    //房型验证其唯一性
    function checkRoomTypeName(roomTypeName) {
        $.ajax({
            type:'POST',
            url:'roomType/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"roomTypeName":roomTypeName},
            success:function (data) {
                if(data==0){
                    layer.tips('此房型名称可用','#roomTypeName', {tips: [2,'green'],time:2000});
                    checkRoomTypeNameIf = true;
                }else {
                    layer.tips('此房型名称已被使用','#roomTypeName', {tips: [2,'red'],time:2000});
                    checkRoomTypeNameIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }


    //验证该房型下有没有客房数据，有则不能删除，否则可以删除
    function checkRoomsOfRoomType(id){
        $.ajax({
            type:"post",
            url:"rooms/getCountByPramas",
            async: false,
            data:{"roomTypeId":id},
            success:function (data) {
                console.log(data);
                if(data==0){
                    checkRoomsOfRoomTypeIf = true; //没有客房数据,可以删除
                }else {
                    checkRoomsOfRoomTypeIf = false; //有客房数据,不能删除
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    //执行房型数据删除
    function delRoomTypeById(id) {
        $.ajax({
            type:"post",
            url:"roomType/delByPrimaryKey",
            data:{"id":id},
            success:function (data) {
                if(data=='success'){
                    loadPageRoomType();  //重新加载当前页
                    loadPage();  //重新加载分页（关键就是加载总的数据条数），因为此时的数据总的条数会变化
                    layer.msg("房型数据删除成功。",{icon: 1,time: 2000,anim:4,shade:0.5})
                }else {
                    layer.msg("房型数据删除失败！",{icon: 2,time: 2000,anim:2,shade:0.5})
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    //修改
    function updRoomType(updJsonRoomType) {
        $.ajax({
            type:"post",
            url:"roomType/updByPrimaryKeySelective",
            data:updJsonRoomType,
            success:function (data) {
                if(data=='success'){
                    loadPageRoomType();  //重新加载当前页
                    layer.msg("房型数据修改成功。",{icon: 1,time: 2000,anim:4,shade:0.5})
                }else {
                    layer.msg("房型数据修改失败！",{icon: 2,time: 2000,anim:2,shade:0.5})
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    //添加
    function saveRoomType(saveJsonRoomType){
        $.ajax({
            type:"post",
            url:"roomType/save",
            data:saveJsonRoomType,
            success:function (data) {
                if(data=='success'){
                    page=1;
                    loadPageRoomType();  //重新加载第1页
                    loadPage();  //重新加载分页（关键就是加载总的数据条数），因为此时的数据总的条数会变化
                    layer.msg("房型数据添加成功。",{icon: 1,time: 2000,anim:4,shade:0.5})
                }else {
                    layer.msg("房型数据添加失败！",{icon: 2,time: 2000,anim:2,shade:0.5})
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    //根据此房型id数据查询多个客房数据
    function loadRoomsByRoomTypeId(roomTypeId){
        $.ajax({
            type:"post",
            url:"rooms/loadManyByPramas",
            data:{"roomTypeId":roomTypeId},
            success:function (data) {
                if(data!=''){  //此房型有客房数据
                    var roomStatus = '<ul class="site-doc-icon site-doc-anim">';
                    $.each(data,function (i,item) {
                        if(item.roomStatus=='0'){
                            roomStatus += '<li style="background-color: #009688;">';
                        }else if(item.roomStatus=='1'){
                            roomStatus += '<li style="background-color: red;">';
                        }else {
                            roomStatus += '<li style="background-color: blueviolet;">';
                        }
                        roomStatus += '<img class="layui-anim" id="demo1" src="'+qnyName+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus += '<div class="code">';
                        roomStatus += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus += '</div>';
                        roomStatus += '</li>';
                    });
                    roomStatus += '</ul>'
                    $("#p"+roomTypeId).html(roomStatus) //点击折叠面板每次获取的roomTypeId不一样,避免id名重复
                }else {  //此房型没有客房数据
                    layer.msg("此房型没有客房数据！",{icon: 7,time: 2000,anim:6,shade:0.5})
                }
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }
});