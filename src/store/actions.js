/**
 * Created by Administrator on 2017/6/28.
 */
import * as types from './mutations-type'

export default {
  //设置所选城市
  setSelCity({commit},flag){
    commit(types.SET_SELCITY,flag)
  },

  //设置所选的导航项
  setSelNav({commit},flag){
    commit(types.SET_NAV,flag)
  },

}
