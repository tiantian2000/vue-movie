/**
 * Created by Administrator on 2017/6/28.
 */
//导入常量定义
import * as types from './mutations-type'
import axios from 'axios'

export default{
   //设置选择的城市
  [types.SET_SELCITY](state,selCity){
    state.selCity = selCity
  },
  //设置所选的导航项
  [types.SET_NAV](state,selNav){
    state.selNav = selNav
  }


}
