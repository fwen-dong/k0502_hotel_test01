package cn.com.fwen.ssm.controller;

import cn.com.fwen.ssm.entity.User;
import cn.com.fwen.ssm.utils.MD5;
import cn.com.fwen.ssm.utils.VerifyCodeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 *   用户控制器层
 */
@Controller
@RequestMapping("/user")
public class UserController extends BaseController<User> {

    //获取验证码
    @RequestMapping("/getVerifyCode")
    public void getVerifyCode(HttpServletResponse response, HttpSession session){
        try {
            //1.获取到随机验证码
            String verifyCode = VerifyCodeUtils.generateVerifyCode(5);
            //2.将生成的随机验证码（转为小写）放在session容器中保存起来
            session.setAttribute("verifyCode",verifyCode.toLowerCase());
            //3.将此随机验证码响应到页面中（将验证码输出图片到页面中）
            VerifyCodeUtils.outputImage(200,35,response.getOutputStream(),verifyCode);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //进行验证码验证
    @RequestMapping("/verifyCheck")
    public @ResponseBody String verifyCheck(String yzm,HttpSession session){
        //1.取出session容器中的验证码（当初随机产生的验证码）
        String verifyCode = (String) session.getAttribute("verifyCode");
        //2.将页面传过来的验证码进行比对
        if(yzm.toLowerCase().equals(verifyCode)){  //将用户输入的转为小写与之前生成的进行比较
            return "success";  //验证码验证成功
        }else {
            return "fail";
        }
    }

    //登录验证
    @RequestMapping("/loginUser")
    public @ResponseBody String loginUser(User loginJsonUser,HttpSession session){
        //将页面传送来的登录密码进行MD5加密后设置到实体封装类中，防止用户密码被泄漏
        loginJsonUser.setPwd(MD5.md5crypt(loginJsonUser.getPwd()));
        try {
            //调用根据条件查询单个用户数据
            User loginUser = baseService.findObjectByPramas(loginJsonUser);
            if(loginUser!=null){  //判断能查询到系统用户数据
                //登陆成功将用户数据装入到session容器中
                session.setAttribute("loginUser",loginUser);
                return "success";
            }else {  //登陆失败
                return "fail";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";  //异常
        }
    }

    //用户退出
    @RequestMapping("/exitUser")
    public @ResponseBody String exitUser(HttpSession session){
        try {
            //1.将session容器中的用户数据删除掉
            session.removeAttribute("loginUser");
            return "success";
        }catch (Exception e){
            e.printStackTrace();
            return "error";
        }
    }


}
