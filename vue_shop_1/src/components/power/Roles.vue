王志祥 15:47:49
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片示图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
           <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'']" v-for="(iteml,i1) in scope.row.children" :key="iteml.id">
             <!-- 渲染一级权限 -->
             <el-col :span="5">
               <el-tag>{{iteml.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 渲染二级和三级权限 -->
             <el-col :span="19">
               <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop']" v-for=" (item2,i2) in iteml.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">
                      {{item2.authName}}
                    </el-tag>
                       <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
             </el-col>
           </el-row>


            <pre>
                {{scope.row}}
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      //   所有角色列表数据
      rolelist: [],
      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,
      //   添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加角色表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            essage: '角色名的长度在3~10个字符之间',
            trigger: 'bulr',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            essage: '角色名的长度在1~10个字符之间',
            trigger: 'bulr',
          },
        ],
      },
      //   控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles', {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败');
      }
      this.rolelist = res.data;

      console.log(this.rolelist);
    },
    // 监听添加用户框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新角色
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //    可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败');
        }
        this.$message.success('添加角色成功');
        //    隐藏添加用户的对话框
        this.addDialogVisible = false;
        //    重新获取角色列表数据
        this.getRolesList();
      });
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return this.message.error('查询用户信息失败');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //  发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户失败');
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 更新数据列表
        this.getRolesList();
        // 提示修改成功
        this.$message.success('更新用户信息成功');
      });
    },
    // 根据id删除对应的用户信息
    async removeUserById(id){
      // 弹框询问用户是否删除
       const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回字符串confirm
        // 如果用户取消了删除，则返回字符串cancel
          if(confirmResult !== 'confirm'){
            return this.$message.info('已取消删除')
          }
          const {data: res} = await this.$http.delete('roles/' + id)
          if(res.meta.status !== 200){
            return this.$message.error('删除用户失败')
          }
          this.$message.success('删除用户成功')
          this.getRolesList(
            
          )
      },
      // 展示分配权限的对话框
    async showSetRightDialog(roles) {
      this.rolesId = roles.id
      // 获取所有权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      // 获取到的权限数据保存
      this.rightsList = res.data
      console.log(this.rightsList)
      // 递归获取三级节点
      this.getLeafKeys(roles, this.defKeys)
      this.SetRightDialogVisible = true
    },
    // 递归的形式,获取角色下所有的三级权限的id,并保存到 defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node没有children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    SetRightDialogVisibleClosed() {
      // 清空 defkeys 数组  避免累积
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.SetRightDialogVisible = false
    }
  },
};
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>


