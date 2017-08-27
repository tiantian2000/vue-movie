<template>
  <div class="about">
    <div>
      <mt-header fiexed title="天天电影" >
        <!--<router-link to="/" slot="left">-->
          <mt-button icon="back" slot="left" @click="goBack">返回</mt-button>
        <!--</router-link>-->
      </mt-header>
    </div>
    <div class="menu">
      <ul >
        <li >最新的电影资讯</li>
        <li >来自豆瓣的适时数据</li>
        <li >技术栈: vue + vue-router + vuex + axios + mint-ui</li>
        <li >版本号: 1.0</li>
        <li >开发者: 天天</li>
        <li >联系作者: QQ 1592770232 </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default{
    methods:{
        goBack(){
          this.$router.goBack();
        }
    }
}
</script>

<style>

 .about .menu ul {
    list-style: none;
    border: 1px solid #e1e1e1;
  }

 .about .menu ul li {
    border-bottom: 1px solid #e5e5e5;
    height: 16px;
    line-height: 16px;
    padding: 18px 0 18px 30px;
    background: url('../assets/sprite.png') no-repeat 0 4px;
    font-family: "microsoft yahei";
    font-size: 15px;
  }
</style>
