<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<%
    String path = request.getContextPath();
    String basePath=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
  <head>
      <base href="<%=basePath%>"/>
      <title>首页</title>
  </head>
  <body>
      <!--根据此路径重定向到管理平台首页-->
      <c:redirect url="model/loginUI"/>
  </body>
</html>
