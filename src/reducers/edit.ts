import {handleActions} from 'redux-actions'
import * as types from '../actions/actionTypes'
import * as utils from '../utils'
import * as _ from 'lodash'

let defaultState = {
  post: {
    media: [],
    coverHidden: false,
    // status: 'public'
    status: 'private',

  },
  initData: null, // 初始化数据，用于比对是否修改过
  error: null,
}

export default handleActions({
  [types.EDIT_INIT]: ({
    next(state, {payload: post}) {
      let newPost = {...state.post, ...post}
      return {
        ...state,
        post: newPost,
        error: null,
        initData: _.cloneDeep(newPost),
      }
    },
    throw(state, {payload: error}) {
      return {
        ...state,
        error: '访问出错：' + error.message
      }
    }
  }),
}, defaultState)