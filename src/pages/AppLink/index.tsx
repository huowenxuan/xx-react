import React from 'react'
import {withStateHandlers, compose, pure} from "recompose"
import './index.less'
import NavBar from "../../components/NavBar"
import images from "../../assets/images"
import * as utils from "../../utils"

export default compose(pure)((props) => {
  const toStore = () => {
    window.location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.girtu.girtu';
  }

  const _renderMask = () => {
    if (!utils.isWxOrQQ) return null
    return (
      <div id="mask" style={{display: 'block'}}>
        <p className="openL">
          如果您已安装糖水,<br/>请使用
          <img src={images.safari}/>
          Safari打开此页面
        </p>
        <img src={images.ts_leader} className="leader"/>
      </div>
    )
  }

  return (
    <div
      style={{backgroundImage: `url(${images.ts_bg})`}}
      className="app-link"
    >
      <NavBar onBack={() => props.history.goBack()}/>
      {_renderMask()}
      <img src={images.ts_logo} className="logo"/>
      <p className="app-name">糖水</p>
      <div
        onClick={toStore}
        className="store-btn"
      >
        前往应用商店下载
      </div>
    </div>
  )
})