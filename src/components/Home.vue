<template>
  <el-container class="home-container">
      <el-header>
          <!-- //后台header -->
        <div>
            <img src="../assets/heima.png" alt="">
          <span>电商管理后台</span>
        </div>
          <el-button type="info" @click="logout">退出</el-button>
      </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <el-aside width="isCollaspe?'60px':'200px'">
          <!-- 折叠按钮 -->
            <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu background-color="#545c64" text-color="#fff"
      active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" 
        :collapse-transition="false" router :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subitem.path" v-for=" subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
          <template slot="title">
              <!-- 图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subitem.authName}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
    <!-- 主体部分 -->
       <el-main>
           <!-- //路由占位符 -->
           <router-view></router-view>
       </el-main>
   </el-container>
 </el-container>
</template>
<script>
export default {
     data() {
        return {
            //左侧导航栏数据
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            isCollapse:false,
            // 被激活的链接地址为空
            activePath:''
        }
    },
    created() {
        this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push("/login")
        },
        //获取所有的请求
        async getMenuList(){
        const{data:res} = await this.$http.get('menus')
        console.log(res)
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        // this.$message.success(res.meta.msg);
        this.menulist=res.data
        },
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath;

        }
    }
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content:space-between;
    padding-left: 0;
    align-items: center;
    color:#fff;
    font-size: 20px;
    > div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: 0;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5084;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>