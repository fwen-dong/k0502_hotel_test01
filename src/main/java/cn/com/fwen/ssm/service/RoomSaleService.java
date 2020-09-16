package cn.com.fwen.ssm.service;

import cn.com.fwen.ssm.entity.RoomSale;

import java.util.Map;

/**
 *   消费记录业务层接口
 */
public interface RoomSaleService extends BaseService<RoomSale> {

    /**
     *   加载客房销售数据
     * @return  图形加载的数据
     * @throws Exception
     */
    Map<String,Object> findRoomSale() throws Exception;
}
