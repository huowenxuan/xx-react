import React from 'react'
import {withStateHandlers, compose, pure} from "recompose"
import './index.less'
import NavBar from "../../components/NavBar"
import images from "../../assets/images"
import * as utils from "../../utils"
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'

export default pageWrapper()((props) => {
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
      <div className='post-new'>
        <div className='background' onClick={addImage}>
          <div className='img-box'>
            <img className='back-img' src={images.new_post_camera}/>
          </div>
        </div>
        <p className='text'>可上传100张图片，一键分享朋友圈</p>
        <div className='open-app-box' onClick={utils.openApp}>
          <div className='open-app'>
            打开糖水App，探索更多有趣玩法
          </div>
        </div>
      </div>
    </div>
  )
})