<template>
  <div class="movie-detail">
    <div>
      <mt-header fixed  :title="movie.title" >
       <!-- <router-link to="/" slot="left">-->
          <mt-button icon="back" slot="left" @click="goBack">返回</mt-button>
       <!-- </router-link>-->
      </mt-header>
    </div>
    <!--<mt-spinner type="triple-bounce" color="#26a2ff" :size="60"  v-if="isloading"></mt-spinner>-->
    <div class="movie-content" v-if="!isloading">
      <div class="movie-header" >
        <img v-show="movie.images.large" :src="movie.images.large"/>
        <div class="content" >
          <h2 class="title">{{movie.title}}
            <span class="sub">{{movie.wish_count}}人想看</span>
            <span class="sub">{{movie.reviews_count}}人看过</span>
          </h2>
          <div class="detail">
            <p><span v-for="(per,index) in movie.genres">{{per}}<span v-if="index<movie.genres.length-1">/</span></span> - {{movie.mainland_pubdate}} {{movie.countries[0]}}上映</p>
            <p>导演: <span v-for="per in movie.directors"><span class="per-name">{{per.name}}</span></span></p>
            <p>主演: <span v-for="per in movie.casts"><span class="per-name">{{per.name}}</span></span></p>
           </div>
        </div>
        <div class="content-summary" >
          <h3 class="desc-title">剧情</h3>
          <div class="summary">{{movie.summary}}</div>
        </div>
        <div class="content-comments">
          <h3 class="desc-title">影评</h3>
          <mt-loadmore
            :bottom-method="loadBottom"
            :bottom-all-loaded="allLoaded"
            :bottomPullText="bottomText"
            :auto-fill="false"
            ref="loadmore">
          <ul>
            <li v-for="item in comments" class="comments-item">
              <div class="user">
                <span class="name">{{item.author.name}}</span>
                <img :src="item.author.avatar" class="avatar">
              </div>
              <div class="star"><star :score="item.rating.value*2"></star></div>
              <div class="time">{{item.created_at}}</div>
              <div class="user-content">{{item.content}}</div>
            </li>
          </ul>
          </mt-loadmore>
        </div>



      </div>

    </div>



  </div>
</template>

<script>
import star from './star/star'
import { Indicator } from 'mint-ui';
export default{
  data(){
    return{
      id:'',
      movie:{
        countries:[],
        image:'',
        images:{

        }
      },
      comments:[],
      isloading:'',
      pageNo: 1, //当前页
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      bottomText: '上拉加载更多...',
      totalPage:'', //总页数
      count:6,
      apikey:'0b2bdeda43b5688921839c8ecb20399b'
    }
  },
  created:function(){
      this.menu();
      this.id = this.$route.params.id;
      this.isloading = true;
      Indicator.open({
        //text:'加载中...',
        spinnerType: 'fading-circle'
      })
      //取电影信息
      //this.$ajax.get('/api/movie/subject/'+this.id,
      this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/subject/'+this.id,
      {params:{apikey:this.apikey}})
      .then(res=>{
        this.movie = res.data
        Indicator.close();
        this.isloading = false;
        console.log(this.movie)
      })
    //取影评
    let start = (this.pageNo - 1) * this.count //计算从第几条开始查询
    //this.$ajax.get('/api/movie/subject/'+this.id+'/comments',
      this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/subject/'+this.id+'/comments',
      {params:{apikey:this.apikey,count:this.count,start:start}})
      .then(res=>{
        console.log(res.data);
        this.comments = this.comments.concat(res.data.comments);
        this.isloading = false;
        //计算总页数(向上取整,有小数就整数部分加1)
        this.totalPage = Math.ceil(res.data.total/this.count);
        if(this.totalPage == this.pageNo){ //已经是最后一页,则禁止上拉加载
          this.allLoaded = true;
        }
        this.$nextTick(function () {
          // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
          // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
          // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
          this.scrollMode = "touch";
        });
        console.log(this.comments)
      })
  },
  components: {
   star
  },
  methods:{
    menu() { //让页面从顶部显示
      window.scrollTo(0,0);
    },
    loadBottom(){
      this.pageNo = this.pageNo + 1;
      let start = (this.pageNo - 1) * this.count //计算从第几条开始查询
      //this.$ajax.get('/api/movie/subject/'+this.id+'/comments',
        this.$ajax.get('https://bird.ioliu.cn/v1?url=https://api.douban.com/v2/movie/subject/'+this.id+'/comments',
        {params:{apikey:this.apikey,count:this.count,start:start}})
        .then(res=>{
          console.log(res.data);
          this.comments = this.comments.concat(res.data.comments);
          this.isloading = false;
          //计算总页数(向上取整,有小数就整数部分加1)
          this.totalPage = Math.ceil(res.data.total/this.count);
          if(this.totalPage == this.pageNo){ //已经是最后一页,则禁止上拉加载
            this.allLoaded = true;
          }
          this.$nextTick(function () {
            // 原意是DOM更新循环结束时调用延迟回调函数，大意就是DOM元素在因为某些原因要进行修改就在这里写，要在修改某些数据后才能写，
            // 这里之所以加是因为有个坑，iphone在使用-webkit-overflow-scrolling属性，就是移动端弹性滚动效果时会屏蔽loadmore的上拉加载效果，
            // 花了好久才解决这个问题，就是用这个函数，意思就是先设置属性为auto，正常滑动，加载完数据后改成弹性滑动，安卓没有这个问题，移动端弹性滑动体验会更好
            this.scrollMode = "touch";
          });
          console.log(this.comments)
        })
      this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
    },
    goBack(){
        this.$router.goBack();
    }
  }
}
</script>

<style>
.movie-header{
  width:100%;
  height:300px;
}

.movie-header img{
  width:100%;
  height:250px;
}

.movie-detail .content{
  padding:10px 18px;

}

.movie-detail .content-summary {
  padding: 10px 18px;
  background-color: #f8f8f8;
}

.movie-detail .content-comments{
  padding:10px 18px;
  background-color: #f8f8f8;
}

.movie-detail .content .title{
  line-height: 24px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color:#07111B;
}

.movie-detail .content .sub{
  font-size:10px;
  line-height: 10px;
  margin-bottom: 18px;
  color:#93999F;
}

.movie-detail .content .detail{
  line-height: 25px;
  letter-spacing: 0.5px;
  font-size: 15px;
}

.movie-detail .content .detail .per-name{
  padding-left: 8px;
}

.movie-detail .content-summary .desc-title{
  line-height: 20px;
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 8px;
  color: #ffb400;
}

.movie-detail .content-summary .summary{
  font-size: 14px;
  line-height: 20px;
  color: #6f7378;
  letter-spacing: 1px;
}

.content-comments .desc-title {
  color: #ffb400;
}

.comments-item{
  position: relative;
  padding:18px;
  border-bottom: 1px dotted #8d8d8d;
}

.comments-item .user{
  padding:18px;
  position: absolute;
  top:0;
  right:0;
}

.comments-item .user .name{
  font-size: 14px;
  color: #b7b7b7;
}

.comments-item .user .avatar{
  width:12px;
  height:12px;
}

.comments-item .user-content{
  padding:12px 0;
  line-height: 18px;
  font-size: 14px;
}

.comments-item .time{
  font-size:12px;
  color: #b7b7b7;
}
</style>
