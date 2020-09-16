package cn.com.fwen.ssm.service.impl;

import cn.com.fwen.ssm.entity.User;
import cn.com.fwen.ssm.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *   用户业务层实现类
 */
@Service
@Transactional(readOnly = false)
public class UserServiceImpl extends BaseServiceImpl<User> implements UserService {
}
