<template>
  <div class="header">
    <div class="swipe-wrapper">
      <mt-swipe :auto="3000" ref="swipeWrapper">
        <mt-swipe-item  v-for="(item,index) in movies" :class="'swip-item-'+(index+1)">
          <img :src="item.images.large" height="100%" width="100%" @click="detail(item.id)">
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <div class="avd">
      <div class="left">
        <span class="avd-city" @click="showSelCity">{{city}}</span>
        <img  class="avd-icon" src="../../assets/004b_50.png" width="15px" height="15px" @click="showSelCity">
      </div>
      <div class="right">
          <input type="text" class="v-inp" v-model="qName" placeholder="搜索" @keyup.enter="search">
      </div>
    </div>

    <!-- 显示可选择的城市-->
    <div class="address"  v-if="isSel">
        <mt-index-list>
          <mt-index-section v-for="(item,index) in citys"  :index="item.charactor" :key="index">
              <mt-cell v-for="(sell,index) in item.cityList" :key="index" :title="sell.name"
                       @click.native="selCity(sell.name)"></mt-cell>
          </mt-index-section>
        </mt-index-list>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        movies: '',
        apikey: '0b2bdeda43b5688921839c8ecb20399b',
        count: 3,
        isSel: false,
        //city: '南京',
        citys: [
          {charactor:'B',cityList:[{name:'北京'}]},
          {charactor:'C',cityList:[{name:'成都'},{name:'常州'}]},
          {charactor:'N',cityList:[{name:'南京'}]},
          {charactor:'S',cityList:[{name:'苏州'},{name:'上海'}]},
          {charactor:'W',cityList:[{name:'无锡'}]}
        ],
        qName:'' //查询的电影名

      }
    } ,
    computed: {
      ...mapGetters({
        city:'getSelCity',
      })},
    mounted:function () {
        this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/coming_soon',
        //this.$ajax.get('/api/movie/coming_soon',
          {params:{city:this.city,apikey:this.apikey,count:this.count}}).then(res=>{
          this.movies = res.data.subjects;
          console.log(this.movies);
        })
        this.$store.dispatch('setSelCity',this.city);
    } ,
    methods: {
      detail(id){
        console.log(id)
        this.$router.push('comingmovieDetail/' + id);
      },
      showSelCity(){
          this.isSel = !this.isSel;
      },
      selCity(name){
        this.isSel = !this.isSel;
        this.$store.dispatch('setSelCity',name);
      },
      search(){
          this.$router.push({ path: 'searchMovie', query: { name: this.qName }})
      }

    }

  }
</script>

<style>

  .header {
    position: relative;
  }
  .header .swipe-wrapper{
    width: 100%;
    height: 200px;

  }
  .header .avd{
    /*width:100%;*/
    position:absolute;
    top:15px;
    left:15px;
    display: flex;
  }

  .header .avd .left{
    flex:1;
  }

  .header .avd-city{
    font-size: 16px;
    color:#fff;
  }


  .header .avd .right{
    flex:3;
    text-align: center;
  }

  .header .v-inp {
    border-style: none;
    border-radius: 15px;
    padding-left: 10px;
    background-color:#fff;
    opacity:.8;
    font-size: 14px;

  }


  .header .address{
    position:absolute;
    top:38px;
    left:0px;
    width:100%;
    z-index: 1000;
  }



</style>
