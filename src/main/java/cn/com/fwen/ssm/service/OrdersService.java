package cn.com.fwen.ssm.service;

import cn.com.fwen.ssm.entity.Orders;

/**
 *   订单业务层接口
 */
public interface OrdersService extends BaseService<Orders> {

    /**
     *   支付成功后的业务层操作
     * @param orderNum 订单编号
     * @return  操作结果
     * @throws Exception
     */
    String afterOrdersPay(String orderNum) throws Exception;
}
