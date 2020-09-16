package cn.com.fwen.ssm.controller;


import cn.com.fwen.ssm.entity.RoomSale;
import cn.com.fwen.ssm.service.BaseService;
import cn.com.fwen.ssm.service.OrdersService;
import cn.com.fwen.ssm.service.RoomSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *   基础公共控制器层
 *   此时由于没有确定泛型T的具体类型，则此类无法直接实例化，所以不需要加实例化注解
 * @param <T>  描述具体封装类型的泛型  此类是无法直接接收页面请求和响应结果
 *               T为User
 */
public class BaseController<T> {

    //依赖注入基础公共业务层对象  T为User  此时的baseService对象为UserService对象
    @Autowired
    protected BaseService<T> baseService;


    //依赖注入订单业务层对象
    @Autowired
    protected OrdersService ordersService;

    //依赖注入客房销售记录业务层对象
    @Autowired
    protected RoomSaleService roomSaleService;

    /**
     *   根据条件分页查询数据
     * @param page  当前页,此参数名字只能是page
     * @param limit  每一页显示的数据条数,此参数名字只能是limit
     * @param  t 查询的条件
     * @return  分页查询的页面路径
     */
    @RequestMapping("/loadPageByPramas")
    public @ResponseBody Map<String,Object> loadPageByPramas(Integer page, Integer limit, T t){
        //新建返回的数据的map集合
        Map<String,Object> map = new HashMap<String, Object>();
        try {
            //执行业务层条件分页查询
            map =  baseService.findPageByPramas(page,limit,t);
            map.put("code",0);  //加载成功
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code",200);   //加载失败
            map.put("msg","数据加载异常");  //异常页面提示
        }
        return map;
    }

    /**
     *   加载所有数据
     * @return  所有数据集合
     */
    @RequestMapping("/loadAll")
    public @ResponseBody List<T> loadAll(){
        try {
            return baseService.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     *  根据主键id删除单个数据
     * @param id  主键id
     * @return  操作结果
     */
    @RequestMapping("/delByPrimaryKey")
    public @ResponseBody String delByPrimaryKey(Integer id){
        try {
            return baseService.removeByPrimaryKey(id);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     *   根据条件加载单个数据
     * @param t  加载的条件
     * @return  单个数据
     */
    @RequestMapping("/loadObjectByPramas")
    public @ResponseBody T loadObjectByPramas(T t) {
        try {
            return baseService.findObjectByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     *   根据条件查询多个数据
     * @param t  查询的条件
     * @return  查询的数据集合
     */
    @RequestMapping("/loadManyByPramas")
    public @ResponseBody List<T> loadManyByPramas(T t){
        try {
            return baseService.findManyByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     *   根据多个主键id批量删除数据
     * @param ids  主键id数组  ids=1001,1002,1003
     * @return  操作的结果
     */
    @RequestMapping("/delBatchByIds")
    public @ResponseBody String delBatchByIds(Integer[] ids){
        try {
            return baseService.removeBatchByIds(ids);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     *   添加数据
     * @param t  添加的数据对象
     * @return  添加结果
     */
    @RequestMapping("/save")
    public @ResponseBody String save(T t){
        try {
            return baseService.save(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     *   动态修改数据
     * @param t 要修改的的数据对象
     * @return  修改的操作结果
     */
    @RequestMapping("/updByPrimaryKeySelective")
    public @ResponseBody String updByPrimaryKeySelective(T t){
        try {
            return baseService.updByPrimaryKeySelective(t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     *   根据多个主键动态批量修改字段数据
     * @param ids 多个主键数组
     * @param t  修改的对象数据
     * @return  修改的结果
     */
    @RequestMapping("/updBatchByPrimaryKeySelective")
    public @ResponseBody String updBatchByPrimaryKeySelective(Integer[] ids,T t){
        try {
            return baseService.updBatchByPrimaryKeySelective(ids,t);
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    /**
     *    根据条件获取数据条数
     * @param t  查询的条件
     * @return  数据条数
     */
    @RequestMapping("/getCountByPramas")
    public @ResponseBody Long getCountByPramas(T t){
        try {
            return baseService.getCountByPramas(t);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
