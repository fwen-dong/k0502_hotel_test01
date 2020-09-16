package cn.com.fwen.ssm.utils;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *修改日期：2017-04-05
 *说明：  ksfxhw3818@sandbox.com   111111
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2021000118644333";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCM1uG6M4wGgtGaWnBFzWeF137JkcQwEVpdgqQWJjGqdPjRbb4Y6LCtLps/BpzupD2qD5gpO63h0/lX7ee7rLaNM0XV2Uy2/GH1R3TyzB4Lph8vC669NHVwZwmadkYAtaz9TSE/9uTiSVrqXDu6Pj/mQ3HIp7c4EXhjTTkSL+NVs0biM4XfhixjegUZPQ/9vtXnTJurKZ0YCqPcKeuxsNBac16YbgZIjd5IqmYpNhGLuvltozDkWXOLILzIbh/y/yy+dEDQNSzfyTofsbgJRBtGkhZFasEahh+3R5QDYGjDzbVcNZcph8XvG9tMKpOpeCLvzQNipWLjWQJLNxEpzDKVAgMBAAECggEAJTQeLLGxK4cjF0MMpWO9FP334AdBa/EpjcoUzkUImZ6Mm8YBkVLmWNkW6W81xVRdda7o4vuA00bLdw7BSDI3htUkfXkJas0Ak2ps2jZROYKIekT7w783xplxT/wuQcG8EK1vOxZdH+mAuqfinzAScSEfzYGARK9YveKIUOWVh+2OgvfQwC8Z3WFI538ManjDIXbgLqqXtDqAXVDZS9kT9/Q9tHIn5IHxi6dSjptfCsS/AkFE7YwD/iAhW3p/KPTK3fXGxnBY4W7/KCVaHz5EbqAagANrNvMAvWVbiEUBtfvuOIq9x0ot0gtAnPV2tCXuwzMlMyUGugn5qObeXS5ngQKBgQDYIKOjYXJnOYyw328Oifs0ngEt6znEmWtvRR5gBdDu/qbK2L99ZnTuekXHZCa3Ai6ePrlT4U44Xbiz588kg24F/Wn+hR0vBHsn+kgfgv/8V4LKiWn1DTxAsoIu5jLb04cIQT3AJ4m16+rmFEp4Gb/2BgzcCx+5j9ybspcWdjeEDwKBgQCm0oDsjEZ9hr7c2aDB5yXaoOzDyjAbO6G9dxYYQo2L7l55mCv8e0SeNxNBst9b3bixM6QycQxkMhPQKJu/wwcoXpr8ygrAjRxgWtExTKYEt6Dn408uj3G+ICBagIqfd6VA6dwQeKW8T/OjtPJFiKvUSkE2ZCWxYmGcQvfi+1FrGwKBgQC4eNNzZn+Bf+uIJI3kOP3DYYHcMcRy/AhpRvOwPgahl5XB2dNIM6Vmz9KzZ9Zrql8kDqGc6Ngc4FIArMFvhwbn8e8AoZnRQd/ktYnN68CXIBKw0S0xToS5LCRV54JNg3TkJNuSIa03LBCpJXSSolfopC1hu9TuS86ezoaLU4f7HQKBgFgHpt6sWxosO5VhBfKsXg5Tcv0SOXZ1bjEDoVYl8HmRzKrPgQ6Xoar3lyLJGBJrGuXvQUsY2pgY0Nm8RAvaB3HnElQo7amUDRBPfCpOryC4IaGcEpGYQkY4v7niMMRbp4lsnqLWd2a6re+KMXo916aLlIP2Lum+55FEyXgudFVXAoGAaIu6ISYBLpnHuGvR7vFgwuPuSx1rK53gh3xPCtsj66GOfjSdVl8mkQjverk09GaVFiEO+eiQslnm86tqhyPWnLV2fZmvZXUmjkOaaUUA7734QX60Q77gQRFSruutMKHtDS6DZZwidVNxn1CYfASpRcg5bRZszyqd1fYxR73ll5A=";

	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjNbhujOMBoLRmlpwRc1nhdd+yZHEMBFaXYKkFiYxqnT40W2+GOiwrS6bPwac7qQ9qg+YKTut4dP5V+3nu6y2jTNF1dlMtvxh9Ud08sweC6YfLwuuvTR1cGcJmnZGALWs/U0hP/bk4kla6lw7uj4/5kNxyKe3OBF4Y005Ei/jVbNG4jOF34YsY3oFGT0P/b7V50ybqymdGAqj3CnrsbDQWnNemG4GSI3eSKpmKTYRi7r5baMw5FlziyC8yG4f8v8svnRA0DUs38k6H7G4CUQbRpIWRWrBGoYft0eUA2Bow821XDWXKYfF7xvbTCqTqXgi780DYqVi41kCSzcRKcwylQIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://工程公网访问地址/alipay.trade.page.pay-JAVA-UTF-8/notify_url.jsp";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	//支付成功后的地址回调（系统自定发送get请求，并且请求中有我们需要用到的参数订单编号out_trade_no）
    //完成支付成功后项目中的其它操作  修改订单支付状态，添加销售记录数据
    public static String return_url = "http://localhost/k0502_hotel-1.0-SNAPSHOT/orders/afterOrdersPay";

	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

