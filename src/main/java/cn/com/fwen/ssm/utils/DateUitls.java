package cn.com.fwen.ssm.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *   将yyyy/MM/dd HH:mm:ss格式的字符串---->java.util.Date
 */
public class DateUitls {

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    //将yyyy/MM/dd HH:mm:ss格式的字符串---->java.util.Date
    public static Date strToDate(String dateStr){
        try {
            return sdf.parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
}
