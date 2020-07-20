import React from 'react'
import {withStateHandlers, compose, pure} from "recompose"
import './index.less'
import NavBar from "../../components/NavBar"
import images from "../../assets/images"
import * as utils from "../../utils"

const PostNew = (props) => {
  const addImage = async () => {
    let photos = await utils.choosePhoto(true, true)
    props.history.push({
      pathname: 'postedit/',
      photos
    })
  }

  return (
    <div>
      <NavBar
        title=''
        backText='主页'
        onBack={() => props.history.goBack()}
      />

      <div id='post-new-back' onClick={addImage}>
        <div id='post-new-back-img-box'>
          <img id='post-new-back-img' src={images.new_post_camera}/>
        </div>
      </div>
      <p id='post-new-text'>可上传100张图片，一键分享朋友圈</p>
      <div id='open-app-box' onClick={utils.openApp}>
        <div id='open-app'>
          打开糖水App，探索更多有趣玩法
        </div>
      </div>
    </div>
  )
}

export default compose(pure)(PostNew)