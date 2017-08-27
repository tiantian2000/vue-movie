<template>
  <div id="app">
    <page-header></page-header>
    <div>
      <mt-navbar v-model="selected">
        <mt-tab-item id="正在上映">正在上映</mt-tab-item>
        <mt-tab-item id="即将上映">即将上映</mt-tab-item>
        <mt-tab-item id="关于">关于我们</mt-tab-item>
      </mt-navbar>
      <router-view></router-view>

    </div>
  </div>
</template>

<script>
  import Header from './header/header.vue'
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        selected:'正在上映',
      }
    },
    watch: {
      selected: function (val, oldVal) {

         // 这里就可以通过 val 的值变更来确定
        if(val === '正在上映'){
          //把选中的导航项存入vuex中
          this.$store.dispatch('setSelNav',val);
          this.$router.push('/nowMovie')
        }
        if(val === '即将上映'){
          //把选中的导航项存入vuex中
          this.$store.dispatch('setSelNav',val);
          this.$router.push('/comingMovie')
        }
        if(val === '关于') this.$router.push('/about')
      }
    },
    computed: {
      ...mapGetters({
        selNav:'getSelNav',
      })},
    mounted:function(){
      console.log(this.selNav);
      //取vuex中选中的导航项
      this.selected = this.selNav;
    },
    components: {
      'page-header':Header
    }
  }
</script>

<style>

</style>
