<template>
  <el-container class="home-container">
      <!--头部区域  -->
  <el-header>
      <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" >退出</el-button>
  </el-header>
   <!-- 页面 主体-->
  <el-container>
     <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggol-button" @click="toggleCollpse">ᨐ</div>
        <!--侧边栏菜单区域  -->
         <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409bff" unique-opened :collapse="isCollapse"
      :collapse-transition="false" router
      :default-active="activePath">
      <!-- 这是一级菜单 -->
      <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
       <el-menu-item :index=" '/'+ subItem.path " v-for="subItem in item.children" 
       :key="subItem.id" @click="saveNavState('/'+ subItem.path)">
           <template slot="title">
            <!-- 图标 -->
          <i class="el-icon-location"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
       </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menulist:[],
            iconsObj:{
                '125':'iconfont  icon-user',
                '103':'iconfont  icon-tijikongjian',
                '101':'iconfont  icon-shangpin',
                '102':'iconfont  icon-danju',
                '145':'iconfont  icon-baobiao'
            },
            //是否折叠
            isCollapse:false,
            //被激活的链接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList()
       
        
    },
    methods: {
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取所有菜单
       async getMenuList(){
          const {data:res} = await this.$http.get('menus')
        if( res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
        },
        //折叠按钮
        toggleCollpse(){
            this.isCollapse = !this.isCollapse

        },
        //保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            
            this.activePath = activePath
        }

    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: rgb(28, 28, 31);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-content: center;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: rgb(51, 55, 63);
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: rgb(246,247,248);
}
.iconfont{
    margin-right: 10px;
}
.toggol-button{
    background-color:#4a5064 ;
    font-size: 15px;
    line-height: 25px;
    color: rgb(246,247,248);
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>