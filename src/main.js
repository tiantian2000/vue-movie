// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//前端路由 SPA Single Page Application 单页应用
import VueRouter from 'vue-router'
import axios from 'axios'
import Mint from './mintUi';
//import Mint from 'mint-ui';
//import 'mint-ui/lib/style.css'
//自动的引入store目录下的index.js
import store from './store'

import Index from './components/index'
import NowMovie from './components/nowmovie'
import About from './components/about'
import ComingMovie from './components/comingmovie'
import ComingMovieDetail from './components/comingmovieDetail'
import NowMovieDetail from './components/nowmovieDetail'
import SearchMovie from './components/searchmovie'
//Vue.use(Mint);

VueRouter.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(VueRouter);
Vue.config.productionTip = false

//将axios改写成Vue的原型属性
Vue.prototype.$ajax = axios;



const router = new VueRouter({
  routes:[
      {path:'/',component:Index,
        children:[ //子路由
          {path:'/',component:NowMovie},
          {path:'nowMovie',component:NowMovie  },
          {path:'comingMovie',component:ComingMovie  },

        ]
      },
      {path:'/comingmovieDetail/:id',component:ComingMovieDetail},
      {path:'/nowMovieDetail/:id',component:NowMovieDetail},
      {path:'/about',component:About  },
      {path:'/searchMovie',component:SearchMovie}
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//组件插入数据流的功能
  template: '<App/>',
  components: { App }
})

