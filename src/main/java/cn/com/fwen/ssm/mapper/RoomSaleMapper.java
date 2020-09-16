package cn.com.fwen.ssm.mapper;

import cn.com.fwen.ssm.entity.RoomSale;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface RoomSaleMapper extends BaseMapper<RoomSale>{

    //根据房间号分组查询房间的销售金额,返回List
    @Select("SELECT room_num,SUM(sale_price) as saleprices from roomsale GROUP BY room_num")
    List<Map<String,Object>> selPriceByRoomNum() throws Exception;
}