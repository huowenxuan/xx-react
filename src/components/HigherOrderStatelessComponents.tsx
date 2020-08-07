'use strict'

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux"
import actions from '../actions/index'
import {withStateHandlers, compose, pure as recomposePure} from "recompose"
import { withRouter } from "react-router";

export const pure = () => {
  return (WrappedComponent) => {
    return compose(recomposePure)(WrappedComponent)
  }
}

// 只包装了state、dispatch的高阶组件
export const reduxWrapper = () => {
  return (WrappedComponent) => {
    return connect(
      state => ({state}),
      dispatch => ({actions: bindActionCreators(actions, dispatch)})
    )(pure()(WrappedComponent))
  }
}

/**
 * 无状态容器高阶组件，包含redux、页面参数等
 */
export const pageWrapper = (params = {}) => {
  return (WrappedComponent) => {
    return withRouter(reduxWrapper()(WrappedComponent))
  }
}
