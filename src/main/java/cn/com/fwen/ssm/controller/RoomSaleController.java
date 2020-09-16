package cn.com.fwen.ssm.controller;

import cn.com.fwen.ssm.entity.RoomSale;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 *   消费记录控制器
 */
@Controller
@RequestMapping("/roomSale")
public class RoomSaleController extends BaseController<RoomSale> {
    /**
     *   加载客房销售数据
     * @return  图形加载的数据
     * @throws Exception
     */
    @RequestMapping("/loadRoomSale")
    public @ResponseBody Map<String,Object> loadRoomSale(){
        try {
            return roomSaleService.findRoomSale();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
