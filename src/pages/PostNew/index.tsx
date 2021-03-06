import React, {useEffect, useState} from 'react'
import './index.less'
import NavBar from "../../components/NavBar"
import Fixed from "../../components/Fixed"
import images from "../../assets/images"
import * as utils from "../../utils"
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'
import overlays from "../../components/overlays";
import qs from "querystring"

export default pageWrapper()((props) => {
  const addImage = async () => {
    let {search} = props.location
    search = qs.decode(search.substr(1))
    const {from, phone} = search
    let query: any = {}
    if (from) query.from = from
    if (phone) query.phone = phone
    try {
      let photos = await utils.choosePhoto(true, true)
      props.history.replaceToEdit(query, {photos})
    } catch (e) {
      overlays.showToast(e.message)
    }
  }

  return (
    <div>
      <NavBar
        title='创作'
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
        <Fixed>
          <div className='open-app-box' onClick={utils.openApp}>
            <div className='open-app'>
              打开糖水App，探索更多有趣玩法
            </div>
          </div>
        </Fixed>
      </div>
    </div>
  )
})