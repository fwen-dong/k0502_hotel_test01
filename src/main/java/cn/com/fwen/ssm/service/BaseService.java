package cn.com.fwen.ssm.service;

import java.util.List;
import java.util.Map;

/**
 *   基础公共的业务层接口
 * @param <T>  描述具体封装类型的泛型  T为User
 */
public interface BaseService<T> {

    /**
     *   根据条件分页查询数据
     * @param page  当前页
     * @param limit  每一页的数据条数
     * @param t  查询的条件
     * @return  分页插件的对象数据
     * @throws Exception
     */
    Map<String,Object> findPageByPramas(Integer page, Integer limit, T t) throws Exception;

    /**
     *   查询所有数据
     * @return  返回查询的数据集合
     * @throws Exception
     */
    List<T> findAll() throws Exception;

    /**
     *   根据条件查询单个数据
     * @param t  加载的条件
     * @return  单个数据
     */
    T findObjectByPramas(T t) throws Exception;

    /**
     *   根据条件加载多个数据
     * @param t  加载的条件
     * @return  多个数据
     * @throws Exception
     */
    List<T> findManyByPramas(T t) throws Exception;

    /**
     *   根据主键id删除单个数据
     * @param id  主键id
     * @return  删除操作结果
     * @throws Exception
     */
    String removeByPrimaryKey(Integer id) throws Exception;

    /**
     *   根据多个主键id批量删除数据
     * @param ids  多个主键id的数组
     * @return  操作的数据条数
     * @throws Exception
     */
    String removeBatchByIds(Integer[] ids) throws Exception;

    /**
     *   添加数据
     * @param t  要添加的数据
     * @return  添加的操作结果
     * @throws Exception  T为User
     */
    String save(T t) throws Exception;

    /**
     *   动态添加（根据具体的字段有值才添加，无值则为null）
     * @param t  要添加的数据
     * @return  添加的操作结果
     * @throws Exception  T为User
     */
    String saveSelective(T t) throws Exception;

    /**
     *   动态修改数据
     * @param t 要修改的的数据对象
     * @return  修改的操作结果
     */
    String updByPrimaryKeySelective(T t) throws Exception;

    /**
     *   修改
     * @param t 要修改的的数据对象
     * @return  修改的操作结果
     */
    String updateByPrimaryKey(T t) throws Exception;

    /**
     *   根据多个主键动态批量修改字段数据
     * @param ids 多个主键数组
     * @param t  修改的对象数据
     * @return  修改的结果
     */
    String updBatchByPrimaryKeySelective(Integer[] ids,T t) throws Exception;

    /**
     *    根据条件获取数据条数
     * @param t  查询的条件
     * @return  数据条数
     */
    Long getCountByPramas(T t) throws Exception;
}
