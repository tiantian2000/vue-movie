<template>
  <div class="search">
    <div>
      <mt-header fiexed title="搜索电影" >
        <router-link to="/" slot="left">
          <mt-button icon="back">返回</mt-button>
        </router-link>
      </mt-header>
    </div>

    <h1 class="title">'{{qName}}'的搜索结果, 共{{total}}条信息</h1>
    <mt-loadmore
      :bottom-method="loadBottom"
      :bottom-all-loaded="allLoaded"
      :bottomPullText="bottomText"
      :auto-fill="false"
      ref="loadmore">
      <div v-for="item in movies" class="movie-child">
      <div class="movie-img"><img :src="item.images.medium" width="120px" height="160px" @click="detail(item.id)"></div>
      <div class="movie-msg">
        <h2 @click="detail(item.id)">{{item.title}}</h2>
        <star :score="item.rating.average"></star>
        <p class="time">({{ item.collect_count }}评价)</p>
        <p class="sub">{{item.rating.average}}</p>
        <p>
          <span v-for="per in item.genres">
            {{per}}
          </span>
        </p>
        <p>主演:<span v-for="per in item.casts">
          {{per.name}}
        </span></p>
        <p class="time">上映:{{item.year}}</p>
      </div>
    </div>
    </mt-loadmore>
  </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  import star from './star/star'
export default{
    data(){
        return{
          qName:'',
          movies:[],
          pageNo: 1, //当前页
          allLoaded: false,
          bottomText: '上拉加载更多...',
          totalPage:'', //总页数
          count:5,
          total:'', //总记录数
        }
    }
    ,
    mounted:function(){
      this.menu();
      this.qName = this.$route.query.name;
      this.fetchData();
    },
    methods:{
      menu() { //让页面从顶部显示
        window.scrollTo(0,0);
      } ,
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
          this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/search',
          //this.$ajax.get('/api/movie/search',
            {params:{q:this.qName,count:this.count,start:start}}).then(res=>{
                console.log(res.data);
                this.total = res.data.total;
                this.movies = res.data.subjects;
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
          })
        },
        detail(id){
          console.log(id)
          this.$router.push('nowMovieDetail/'+id);
      }
    } ,
    components:{
     star
    },
}
</script>

<style>
.search .title {
  font-size: 16px;
  font-weight: 500;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  background-color: #f2fbfb;
}

.search .movie-child{
  display: flex;
  /*align-items: flex-end;*/
  padding: 5px 5px;
  border-bottom: 1px solid #d6d6d6;
  position: relative;

}
.search .movie-img{
  flex:0.7;
}
.search .movie-msg{
  flex:1;
  vertical-align: top;
  padding-left: 10px;
}

.search .movie-msg h2 {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #7a7a7a;
  margin: 8px 0;
  line-height: 21px;
}

.search .movie-msg p {
  font-size: 14px;
  color: #6b6b6b;
  margin:5px 0;
  letter-spacing: 1px;
  line-height: 18px;
}



.search .movie-msg .time{
  font-size:10px;
  color: #9b9b9b;
}

.search .movie-msg .sub {
  font-size: 24px;
  color: #FF6600;
  font-style: italic;
  vertical-align: middle;
  position: absolute;
  top:50px;
  right:10px;
}



</style>
