layui.use(['jquery','layer','form'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , form = layui.form  //引用form表单模块


    var verifyCheckIf = false;  //验证码验证的判断

    //判断是否被拦截转发到的登陆页面
    if($("#loginUIMsg").val()=="loginUIMsg"){  //是被拦截的
        layer.msg("对不起，请先登陆！！",{icon: 7,time:2000,anim: 6,shade:0.5});
    }

    //给系统用户输入验证码的输入框绑定失去焦点事件，进行验证码验证
    $("#yzm").blur(function () {
        var yzm = $(this).val();  //获取用户输入的验证码
        if(yzm.length==5){
            //进行服务器端的验证码验证
            verifyCheck(yzm);
        }else {
            layer.tips('验证码格式错误！','#yzm', {tips: [2,'red'],time:2000,tipsMore: true});
        }
    });

    form.verify({
        userName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            if(value.length<3||value.length>12){
                return '用户名长度为3-12位';
            }
        }
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格']
        ,yzm:function (value, item) { //value：表单的值、item：表单的DOM对象
             if(!verifyCheckIf){
                    return "验证码不正确！";
             }
        }
    });

    //监听表单的提交登陆
    form.on('submit(login)', function (data) {
        //data.field得到的JSON数据中的key值为输入标签的name属性值,得到的JSON数据中的value值为用户填入的值
        var loginJsonUser = data.field;
        loginUser(loginJsonUser);  //执行登陆
        layer.closeAll(); //验证没有问题，则关闭弹框
        return false;  //阻止表单跳转提交
    });

    //服务器端的验证码验证
    function verifyCheck(yzm) {
        $.ajax({
            type:'POST',
            url:'user/verifyCheck',  //调用的是base系列的方法，只需要改mapper.xml文件
            async:false,  //表示可以在ajax外部取得ajax中的数据
            data:{"yzm":yzm},
            success:function (data) {
                if(data=='success'){  //验证码验证成功
                    layer.tips('验证码验证正确。','#yzm', {tips: [2,'green'],time:2000,tipsMore: true});
                    verifyCheckIf = true;
                }else {  //验证失败
                    layer.tips('验证码验证错误！','#yzm', {tips: [2,'red'],time:2000,tipsMore: true});
                    verifyCheckIf = false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }


    //登陆
    function loginUser(loginJsonUser) {
        $.ajax({
            type:'POST',
            url:'user/loginUser',  //调用的是base系列的方法，只需要改mapper.xml文件
            data:loginJsonUser,
            success:function (data) {
                if(data=='success'){  //登陆成功
                    layer.msg("登陆成功。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到平台首页页面
                    setTimeout('window.location="model/toIndex"',2000);
                }else {  //登录失败
                    layer.msg("登陆失败！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});