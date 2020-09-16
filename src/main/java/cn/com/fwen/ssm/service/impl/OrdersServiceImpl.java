package cn.com.fwen.ssm.service.impl;

import cn.com.fwen.ssm.entity.InRoomInfo;
import cn.com.fwen.ssm.entity.Orders;
import cn.com.fwen.ssm.entity.RoomSale;
import cn.com.fwen.ssm.entity.Rooms;
import cn.com.fwen.ssm.service.OrdersService;
import cn.com.fwen.ssm.utils.DateUitls;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *   订单业务层实现类
 */
@Service
@Transactional(readOnly = false)
public class OrdersServiceImpl extends BaseServiceImpl<Orders> implements OrdersService {

    //订单添加的同时要完成如下操作
    //1.生成订单数据(以订单的添加为主)
    //2.入住信息是否退房的状态的修改（未退房-->已退房）
    //3.客房的状态修改（已入住-->打扫）
    //要不全部成功，要不全部失败，所以必须控制在一个业务层事物中
    //重写父类的添加的方法
    @Override
    public String save(Orders orders) throws Exception {
        //1.生成订单数据(以订单的添加为主)
        int insOrdersCount = baseMapper.insert(orders);//此时的baseMapper对象中的泛型T为Orders

        //2.入住信息是否退房的状态的修改（未退房-->已退房）
        //2.1新建要被修改的入住信息对象
        InRoomInfo inRoomInfo = new InRoomInfo();
        //2.2往要被修改的入住信息中设置值
        inRoomInfo.setId(orders.getIriId());
        inRoomInfo.setOutRoomStatus("1");
        //2.3执行入住信息的修改
        int updInRoomInfoCount = inRoomInfoMapper.updateByPrimaryKeySelective(inRoomInfo);
        //自定义异常
        //int i = 1/0;  //除数为0的异常，代码到此处停止下来就不会继续向下执行

        //3.客房的状态修改（已入住-->打扫） 1---->2
        //3.1根据入住信息id查询入住信息
        InRoomInfo selInRoomInfo = inRoomInfoMapper.selectByPrimaryKey(orders.getIriId());
        //3.2新建客房对象
        Rooms rooms = new Rooms();
        //3.3往要被修改的客房信息中设置值
        rooms.setId(selInRoomInfo.getRoomId());
        rooms.setRoomStatus("2");
        int updRoomsCount = roomsMapper.updateByPrimaryKeySelective(rooms);
        if(insOrdersCount>0&&updInRoomInfoCount>0&&updRoomsCount>0){
            return "success";
        }else {
            return "fail";
        }
    }

    @Override
    public String afterOrdersPay(String orderNum) throws Exception {
        //1.根据订单编号查询单个订单数据
        //1.1.新建订单查询的条件对象
        Orders praOrders = new Orders();
        //1.2.将订单编号设置进去
        praOrders.setOrderNum(orderNum);
        //1.3.执行条件查询单个数据
        Orders orders = baseMapper.selectObjectByPramas(praOrders);
        //2.修改订单支付状态 由0（未结算）---->1（已结算）
        //2.1.新建修改的订单对象
        Orders updOrders = new Orders();
        //2.2.将订单主键id和状态设置进去
        updOrders.setId(orders.getId());
        updOrders.setOrderStatus("1");
        //2.3.执行动态修改
        int updOrdersCount = baseMapper.updateByPrimaryKeySelective(updOrders);
        //3.完成销售记录的添加
        //3.1.新建销售记录对象
        RoomSale roomSale = new RoomSale();
        //3.2.往此对象中设置数据
        String[] orderOthers = orders.getOrderOther().split(",");
        roomSale.setRoomNum(orderOthers[0]);
        roomSale.setCustomerName(orderOthers[1]);
        roomSale.setStartDate(DateUitls.strToDate(orderOthers[2]));
        roomSale.setEndDate(DateUitls.strToDate(orderOthers[3]));
        roomSale.setDays(Integer.valueOf(orderOthers[4]));
        String[] orderPrice = orders.getOrderPrice().split(",");
        //房屋单价
        roomSale.setRoomPrice(Double.valueOf(orderPrice[0]));
        //其它消费
        roomSale.setOtherPrice(Double.valueOf(orderPrice[1]));
        //实际住宿费
        roomSale.setRentPrice(Double.valueOf(orderPrice[2]));
        //订单的实际支付金额(订单的支付总金额)
        roomSale.setSalePrice(orders.getOrderMoney());
        //优惠金额（客房单价*天数-实际的住房金额）
        Double discountPrice = roomSale.getRoomPrice()*roomSale.getDays()-roomSale.getRentPrice();
        roomSale.setDiscountPrice(discountPrice);
        //3.3.执行消费记录的添加
        int insRoomSaleCount = roomSaleMapper.insert(roomSale);
        if (updOrdersCount>0&&insRoomSaleCount>0){
            return "redirect:/model/toIndex";  //重定向到首页
        }else {
            return "redirect:/model/toErrorPay";  //重定向到异常页
        }
    }
}
