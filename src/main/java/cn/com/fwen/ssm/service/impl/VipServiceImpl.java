package cn.com.fwen.ssm.service.impl;

import cn.com.fwen.ssm.entity.Vip;
import cn.com.fwen.ssm.service.VipService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *   会员业务层实现类
 */
@Service
@Transactional(readOnly = false)
public class VipServiceImpl extends BaseServiceImpl<Vip> implements VipService {
}
