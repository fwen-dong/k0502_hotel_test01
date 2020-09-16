layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var vipIf = false;  //验证会员卡号的数据是否存在的全局变量

    var checkIdCardIf = false;  //判断身份证的唯一性全局变量

    var checkPhoneIf = false;  //判断手机号的唯一性全局变量

    //加载所有空闲的客房
    loadRoomsByRoomStatus("0");


    //执行一个laydate实例
    laydate.render({
        elem: '#createDate' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,calendar: true ////允许显示公历节日
        ,value:new Date()  //初始值为系统当前时间
        ,min:0  //表示只能选则当前数据之后的时间
    });


    //监听会员非会员的选则
    form.on('radio(isVip)', function(data){
        $("form").eq(0).find('input:text').val("");  //清空表单之前的数据
        if(data.value=='1'){
            //是会员
            isVipTrue();
        }else {
            //非会员
            isVipFalse();
        }
    });


    //给会员卡号输入框失去焦点事件
    $("#vip_num").blur(function () {
        //失去焦点时会有卡号验证
        var vipNum = $(this).val();
        //验证会员卡号的格式
        if((/(^[1-9]\d*$)/.test(vipNum))){
            if(vipNum.length==16){  //验证长度
                //发送ajax请求，查询会员卡号
                loadVipByVipNum(vipNum);  //根据会员卡号加载单个会员数据
            }else {
                //吸附框  会员卡号长度必须位16位：提示内容  ，#vip_num吸附的标签
                //{tips: [2,'green'],time:2000}  弹出位置（上右下左1-4）   背景颜色  显示时间
                layer.tips('会员卡号长度必须位16位','#vip_num', {tips: [2,'red'],time:2000});
            }
        }else {
            layer.tips('会员卡号必须为正整数','#vip_num', {tips: [2,'red'],time:2000});
        }
    });


    //监听提交完成入住信息添加
    form.on('submit(demo1)', function (data) {
        //得到的JSON数据中的key值为输入标签的name属性值，得到的JSON数据中的value值为用户填入的值
        var saveJsonInRoomInfo = data.field;
        saveJsonInRoomInfo['outRoomStatus'] = '0';
        saveJsonInRoomInfo['status'] = '1';
        //执行添加，1.入住信息添加  2.(Rooms)房间的状态由0（空闲）---->1（已入住）
        saveInRoomInfo(saveJsonInRoomInfo);
        return false;  //阻止表单跳转提交
    });

    //自定义验证
    form.verify({  //做表单提交时的验证
        //vip_num是lay-verify="属性值"
        //value：表单的值、item：表单的DOM对象

        vip_num: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(value<=0){
                return '会员卡号有误';
            }
            if(value.length!=16){
                return '会员卡号的长度必须为16位';
            }
        },

        money:function (value) {
            if(value<100 || value>2000){
                return '押金范围在100-2000元之内';
            }
        },

        checkIdCard: function(value, item){ //value：表单的值(用户输入值)、item：表单的DOM对象
            checkIdCard(value);  //身份证的唯一性验证，发送ajax请求访问数据库
            if(!checkIdCardIf){
                return '该身份证号已被使用！！';
            }
        },

        checkPhone: function(value, item){ //value：表单的值(用户输入值)、item：表单的DOM对象
            checkPhone(value);  //手机号的唯一性验证，发送ajax请求访问数据库
            if(!checkPhoneIf){
                return '该手机号已被使用！！';
            }
        }
    });

    /************************************自定义函数*************************************/

    //是会员的表单操作
    function isVipTrue() {
        //attr(属性名, 属性值)：设置属性的值，removeAttr:移除一个属性（attribute）；
        $("#vip_num").removeAttr("disabled")  //将会员卡号输入框可用
        $("#vip_num").attr("lay-verify","required|number|vip_num"); //添加验证的属性值
        //将客人姓名，手机号，身份证号，性别均不可用
        $("#customerName").attr("disabled","disabled");
        $("input[name=gender]").attr("disabled","disabled");
        $("#idcard").attr("disabled","disabled");
        $("#phone").attr("disabled","disabled");
        $("#idcard").removeAttr("lay-verify")  //移除验证的属性值
        $("#phone").removeAttr("lay-verify")  //移除验证的属性值
    }

    //非会员的表单操作
    function isVipFalse() {
        //attr(属性名, 属性值)：设置属性的值
        $("#vip_num").attr("disabled","disabled"); //将会员卡号输入框不可用
        $("#vip_num").removeAttr("lay-verify")  //移除验证的属性值
        //将客人姓名，手机号，身份证号，性别均可用
        $("#customerName").removeAttr("disabled");
        $("input[name=gender]").removeAttr("disabled");
        $("#idcard").removeAttr("disabled");
        $("#phone").removeAttr("disabled");
    }


    //根据会员卡号加载单个会员数据
    function loadVipByVipNum(vipNum) {
        $.ajax({
            type:'POST',
            url:'vip/loadObjectByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"vipNum":vipNum},
            success:function (data) {
                if(data!=''){
                    vipIf = true;
                    //表单数据的赋值
                    //1.2给表单赋值(基础属性回显)
                    form.val("example", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                        "customerName": data.customerName
                        ,"gender": data.gender
                        ,"idcard": data.idcard
                        ,"phone": data.phone
                    });
                    layer.tips('已查出此会员数据','#vip_num', {tips: [2,'green'],time:2000});
                }else {
                    vipIf = false;
                    layer.tips('没有此会员数据','#vip_num', {tips: [2,'red'],time:2000});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //加载所有空闲的客房
    function loadRoomsByRoomStatus(roomStatus) {
        $.ajax({
            type:'POST',
            url:'rooms/loadManyByPramas', //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"roomStatus":roomStatus},
            success:function (data) { //请求路径正确时的函数回调，data为响应回来的JSON数据
                var roomStr='<option value="" >--请选择房间--</option>';
                //通过对data数据集合进行循环，将数据和标签加载到页面(room自定义单条数据对象变量名)
                $.each(data,function (i,room) {
                    roomStr += '<option value="'+room.id+'">'+room.roomNum+'-'+room.roomType.roomTypeName+'-'+room.roomType.roomPrice+'</option>';
                })
                $("#selRoomNumId").html(roomStr);
                form.render('select'); //渲染下拉框（只要有数据更新则需要渲染更新页面缓存）
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 6,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //添加入住信息
    function  saveInRoomInfo(saveJsonInRoomInfo) {
        $.ajax({
            type:'POST',
            url:'inRoomInfo/save',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:saveJsonInRoomInfo,
            success:function (data) {
                if(data=='success'){
                    layer.msg("入住信息添加成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到入住信息显示页面
                    setTimeout('window.location="model/toShowInRoomInfo"',2000);
                }else {
                    layer.msg("入住信息添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //身份证的唯一性验证
    function checkIdCard(idcard) {
        $.ajax({
            type:'POST',
            url:'vip/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"idcard":idcard},
            success:function (data) {
                if(data==0){
                    //tipsMore: true允许多个吸附框的弹出
                    layer.tips('此身份证号可以使用','#idcard', {tips: [2,'green'],time:2000,tipsMore: true});
                    checkIdCardIf = true;
                }else {
                    layer.tips('此身份证号已被使用','#idcard', {tips: [2,'red'],time:2000,tipsMore: true});
                    checkIdCardIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //手机号的唯一性验证
    function checkPhone(phone) {
        $.ajax({
            type:'POST',
            url:'vip/getCountByPramas',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"phone":phone},
            success:function (data) {
                if(data==0){
                    layer.tips('此手机号可以使用','#phone', {tips: [2,'green'],time:2000,tipsMore: true});
                    checkPhoneIf = true; //该手机号没有被使用
                }else {
                    layer.tips('此手机号已被使用','#phone', {tips: [2,'red'],time:2000,tipsMore: true});
                    checkPhoneIf = false; //该手机号已被使用
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})