<template>
  <div class="comingmovie-list">
    <!--<mt-spinner type="triple-bounce" color="#26a2ff" :size="60" v-if="isloading"></mt-spinner>-->
    <mt-loadmore
      :top-method="loadTop"
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :bottomPullText="bottomText"
      :auto-fill="false"
      ref="loadmore">
        <div v-for="item in movies" class="movie-child">
          <div class="movie-img"><img :src="item.images.medium" width="120px" height="160px" @click="detail(item.id)"></div>
          <div class="movie-msg">
            <h2 @click="detail(item.id)">{{item.title}}<span class="collect">({{item.collect_count}}人评价)</span></h2>
            <p>
              <span v-for="per in item.genres">
                {{per}}
              </span>
            </p>
            <p>导演:<span v-for="per in item.directors">
              {{per.name}}
            </span></p>
            <p>主演:<span v-for="per in item.casts">
              {{per.name}}
            </span></p>
            <p>片长:{{item.durations[0]}}</p>
            <p>上映:{{item.mainland_pubdate}}</p>
           </div>
        </div>
    </mt-loadmore>
  </div>
</template>

<script>

  import { Indicator } from 'mint-ui';
  export default {
    data(){
      return{
        movies:[],
        pageNo: 1, //当前页
        allLoaded: false,
        bottomText: '上拉加载更多...',
        totalPage:'', //总页数
        count:5,
        apikey:'0b2bdeda43b5688921839c8ecb20399b'
      }
    }  ,
    mounted:function () {
      this.fetchData();
    } ,
    methods:{
      loadBottom(){
        this.pageNo = this.pageNo + 1;
        //加载一页数据
        this.fetchData();
        this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
      },
      fetchData(){
        Indicator.open({
          spinnerType: 'fading-circle'
        })
        let start = (this.pageNo - 1) * this.count //计算从第几条开始查询
        this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/coming_soon',
        //this.$ajax.get('/api/movie/coming_soon',
          {params:{apikey:this.apikey,count:this.count,start:start}}).then(res=>{
          this.movies = this.movies.concat(res.data.subjects);
          this.$nextTick(function () {
            // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
            // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
            // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
            this.scrollMode = "touch";
          });
          Indicator.close();
          //计算总页数(向上取整,有小数就整数部分加1)
          this.totalPage = Math.ceil(res.data.total/this.count);
          if(this.totalPage == this.pageNo){ //已经是最后一页,则禁止上拉加载
            this.allLoaded = true;
          }
          console.log(res.data);
        })
      },
      detail(id){
        console.log(id)
        this.$router.push('/comingmovieDetail/'+id);
      },
      loadTop(){
        //初始化数据
        this.pageNo = 1;
        this.movies = [];
        this.allLoaded = false;
        this.fetchData();
        this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
      }
    }
  }
</script>


<style>
  .comingmovie-list{
    background-color: #f8f8f8;
    cursor: pointer;
    padding: 10px 20px;
  }
  .comingmovie-list .movie-child{
    display: flex;
    /*align-items: flex-end;*/
    padding: 5px 5px;
    border-bottom: 1px solid #d6d6d6;
    position: relative;

  }
  .comingmovie-list .movie-img{
    flex:0.7;
  }
  .comingmovie-list .movie-msg{
    flex:1;
    vertical-align: top;
    padding-left: 10px;
  }

  .comingmovie-list .movie-msg h2 {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 2px;
    color: #7a7a7a;
    margin: 8px 0;
    line-height: 15px;
  }

  .comingmovie-list .movie-msg p {
    font-size: 12px;
    color: #6b6b6b;
    margin:5px 0;
    letter-spacing: 1px;
    line-height: 15px;
  }

  .comingmovie-list .movie-msg .collect{
    letter-spacing: 0px;
    padding-left: 10px;
    font-size:8px;
    color: #9b9b9b;
  }

</style>
