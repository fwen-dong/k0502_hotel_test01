package HotelTest;

import cn.com.fwen.ssm.entity.InRoomInfo;
import cn.com.fwen.ssm.service.InRoomInfoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;
import java.util.Map;

public class InRoomInfoTest {
    //日志对象
    private static final Logger log = LogManager.getLogger(InRoomInfoTest.class);

    //定义applicationContext对象
    private ApplicationContext applicationContext;

    private InRoomInfoService inRoomInfoService;
    @Before
    public void before(){
        //测试之前读取spring——config.xml文件
        applicationContext = new ClassPathXmlApplicationContext("spring-main.xml");
        //获取员工业务层对象
        inRoomInfoService=applicationContext.getBean("inRoomInfoServiceImpl",InRoomInfoService.class);
    }

    @Test
    public void fun01(){
        InRoomInfo inRoomInfo=new InRoomInfo();
        try {
            Map<String, Object> map = inRoomInfoService.findPageByPramas(1, 3, inRoomInfo);
            log.info("-------------------------------------");
            log.info("共有"+map.get("count")+"条数据");
            List<InRoomInfo> inRoomInfos=(List<InRoomInfo>)map.get("data");
            for (InRoomInfo i:inRoomInfos){
                log.info(i.getCustomerName()+":"+i.getPhone());
                log.info("----------------------------------");
                log.info(i.getRooms());
                log.info("----------------------------------");
                log.info(i.getRooms().getRoomType());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
