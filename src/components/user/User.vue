<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
    <el-card >
        <el-row :gutter="20"> 
            <!-- 搜索与添加区域 -->
            <el-col :span="7">
              <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <el-table :data="userlist" border stripe>
            <el-table-column type="index"></el-table-column>     
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg-state">
                <template slot-scope="scope" >
                    <!-- {{scope.row}} -->
                    <el-switch v-model="scope.row.mg_state" @change="UserStateChange(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
                <template v-slot="scope">
                    <!-- 修改按钮 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="getUserInfoById(scope.row.id)"></el-button>
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    <!-- 分配角色按钮 -->
                    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" enterable>
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页效果 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
        </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="60%" @close="addDialogClose">
        <!-- 主体区  -->
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px" >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>  
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
        title="修改信息"
        :visible.sync="editDialogVisible"
        width="60%" @close="editDialogClose">
        <!-- 主体区  -->
        <el-form :model="editForm" :rules="addFormrules" ref="editFormRef" label-width="70px" >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>  
        </el-form>
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        //验证邮箱的规则
        var checkEmail=(rule,value,cb)=>{
            const regEmail=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if(regEmail.test(value)){
                //合法邮箱
                 cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        //验证手机号的规则
        var checkMobile=(rule,value,cb)=>{
            const regMobile=/^1[345789]\d{9}$/;
            if(regMobile.test(value)){
                //合法邮箱
                 cb()
            }
            cb(new Error('请输入合法的手机号'))   
        }
        return {
            //获取get查询参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userlist:[],
            total:0,
            //添加弹窗的状态
            addDialogVisible:false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //添加用户的表单验证规则
            addFormrules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required:true,message:'请输入手机号',trigger:'blur'},
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur'}
                ]
            },
            // 修改用户表单弹出与隐藏
            editDialogVisible:false,
            // 修改用户表单数据
            editForm:{
                username:'',
                email:'',
                mobile:''
            },
        }   
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList(){
            const{data:res}=await this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status!==200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userlist=res.data.users
            this.total=res.data.total
            // console.log(res); 
        },
        // 监听每页的条数
        handleSizeChange(newSize){
            // console.log(newSize);
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },
        // 监听当前在第几页
        handleCurrentChange(newPage){
            console.log(newPage);
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        //监听 用户状态
        async UserStateChange(userinfo){
          const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
          if(res.meta.status!==200){
              userinfo.mg_state=!userinfo.mg_state
              return this.$message.error('更新用户状态失败')
          }
          this.$message.success('更新用户状态成功')
        },
        //监听添加用户框的关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser(){
            this.$refs.addFormRef.validate( async valid=>{
                // console.log(valid);
                if(!valid) return
                // 可以发起添加用户的网络请求
              const {data:res}= await this.$http.post('users',this.addForm)
              if(res.meta.status!==201){
                  this.$message.error('添加用户失败！')
              }
                this.$message.success('添加用户成功')
                this.addDialogVisible=false
                // 重新获取用户列表数据
                this.getUserList()
            })
        },
    // 监听修改用户的关闭事件
    editDialogClose(){
        this.$refs.editFormRef.resetFields()
    },
    // 根据id获取要修改的信息
    async getUserInfoById(id){
        this.editDialogVisible=true
        const {data:res}= await this.$http.get('users/'+id,this.editForm)
         if(res.meta.status!==200){
             this.$message.error('获取用户失败！')
              }    
            this.editForm=res.data
    },
    // 点击修改按钮修改用户信息
    editUser(){
        // console.log(this.id);
    this.$refs.editFormRef.validate( async valid=>{
         // console.log(valid);
         if(!valid) return
        // 可以发起添加用户的网络请求
         const {data:res}= await this.$http.put('users/'+this.editForm.id,this.editForm)
        if(res.meta.status!==200){
            this.$message.error('添加用户失败！')
        }
         this.$message.success('添加用户成功')
         this.editDialogVisible=false
         // 重新获取用户列表数据
         this.getUserList()
         })
     }
    },
}
</script>
<style lang="less" soped>
    
</style>