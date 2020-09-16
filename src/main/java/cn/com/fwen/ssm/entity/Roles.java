package cn.com.fwen.ssm.entity;

import java.util.Date;

public class Roles {
    /** 主键 */
    private Integer id;

    /** 角色名 */
    private String roleName;

    /** 角色创建时间 */
    private Date createDate;

    /** 角色禁用启用状态，1启用,0禁用 */
    private String status;

    /** 1超級角色  0普通角色 */
    private String flag;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName == null ? null : roleName.trim();
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag == null ? null : flag.trim();
    }
}