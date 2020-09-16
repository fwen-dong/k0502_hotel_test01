<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!--http://localhost:8080/-->
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<head>
    <!--引用基础路径-->
    <base href="<%=basePath%>"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>标题</title>
    <!--引入的js文件-->
    <script src="static/lib/echarts/echarts.min.js"></script>
    <script src="static/lib/echarts/jquery.min.js"></script>
</head>
<body>
    <!--数据显示的容器 -->
    <div align="center" id="main" style="width: 1000px;height:600px;"></div>
</body>
    <script src="static/js/dbi/showdbi.js"></script>
</html>