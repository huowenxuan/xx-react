'use strict'

import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from "redux"
import actions from '../actions/index'
import { withRouter } from "react-router";

export const reduxTmp = () => {
  return (Comp) => {
    return connect(
      state => ({state}),
      dispatch => ({actions: bindActionCreators(actions, dispatch)})
    )(Comp)
  }
}

// 只包装了state、dispatch的高阶组件
export const reduxWrapper = () => {
  return (WrappedComponent) => {
    return connect(
      state => ({state}),
      dispatch => ({actions: bindActionCreators(actions, dispatch)})
    )(WrappedComponent)
  }
}

/**
 * 页面容器高阶组件，包含redux、页面参数等
 */
export const pageWrapper = () => {
  return (Container) => {
    class WrappedComponent extends PureComponent {
      componentDidMount() {
        super.componentDidMount && super.componentDidMount()
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount()
      }

      render() {
        let params = {}
        // if (_.has(this.props, 'navigation.state.params')) {
        //   params = this.props.navigation.state.params
        // }
        return <Container {...this.props} {...params}/>
      }
    }

    return withRouter(reduxWrapper()(WrappedComponent))
  }
}