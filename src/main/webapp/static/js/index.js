// 配置
layui.config({
	base: './static/hpModules/' // 扩展模块目录
}).extend({ // 模块别名 ，引入自定义模块
	hpTab: 'hpTab/hpTab',
	hpRightMenu: 'hpRightMenu/hpRightMenu',
	hpFormAll: 'hpFormAll/hpFormAll',
});

//JavaScript代码区域
layui.use(['element', 'carousel','hpTheme', 'hpTab', 'hpLayedit', 'hpRightMenu'], function() {
	
	var element = layui.element;
	var carousel = layui.carousel; //轮播
	var hpTab = layui.hpTab;
	var hpRightMenu = layui.hpRightMenu;
	var hpTheme=layui.hpTheme;
	$ = layui.$;
	
    // 初始化主题
	hpTheme.init();
	 //初始化轮播
	carousel.render({
		elem: '#test1',
		width: '100%', //设置容器宽度
		interval: 1500,
		height: '500px',
		arrow: 'none', //不显示箭头
		anim: 'fade', //切换动画方式
	});

    // 初始化 动态tab
    hpTab.init();
    // 右键tab菜单
    hpRightMenu.init();


    $("#exit").click(function () {
        layer.confirm('真的要退出此平台吗？', function (index) {
            exitUser();
            layer.close(index);  //关闭当前的询问框
        });
    })


    //用户退出
    function exitUser() {
        $.ajax({
            type:'POST',
            url:'user/exitUser',  //调用的是base系列的方法，只需要改mapper.xml文件
            success:function (data) {
                if(data=='success'){
                    layer.msg("退出成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到登陆页面
                    setTimeout('window.location="model/loginUI"',2000);
                }else {
                    layer.msg("退出失败",{icon: 2,time:2000,anim: 5,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
            }
        });
    }

});