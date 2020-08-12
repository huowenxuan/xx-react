import React, {useEffect, useState} from 'react'
import './index.less'
import NavBar from "../../components/NavBar"
import Fixed from "../../components/Fixed"
import overlays from "../../components/overlays"
import images from "../../assets/images"
import * as utils from "../../utils"
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'
import dayjs from 'dayjs'

export default pageWrapper()((props) => {
  const {drafts} = props.state.draft
  useEffect(() => {
    props.actions.findDrafts(props.user.userId)
  }, [props.user])

  const toEdit = (e, data) => {
    e.stopPropagation()
    props.history.toEdit({
      draftId: data.draftId
    })
  }

  const del = (e, data) => {
    e.stopPropagation()
    overlays.showAlert('确定删除草稿吗？', '', [
      {text: '取消'},
      {
        text: '删除', textColor: '#FF4542', onPress: () => {
          props.actions.deleteDraft(props.user.userId, data.draftId)
        }
      },
    ])
  }

  console.log(drafts)
  return (
    <div className='drafts-page'>
      <Fixed style={{zIndex: -1}}>
        <div className='background'/>
      </Fixed>
      <NavBar
        title='草稿箱'
        backText='主页'
        onBack={() => props.history.goBack()}
      />
      <ul className='main'>
        {drafts.map((data) => (
          <li
            className='item'
            key={data.draftId}
            onClick={(e) => toEdit(e, data)}
          >
            <div className='title-row'>
              <img
                className='img'
                src={data.headbacimgurl || images.post_cover_placeholder}
              />
              {data.title}
            </div>
            <div className='line'/>
            <div className='action-row'>
              {data.updated_at ? dayjs(data.updated_at).format('YYYY-MM-DD HH:mm:ss') + ' 保存' : <p/>}
              <div className='actions'>
                <div className='btn' onClick={(e) => toEdit(e, data)}>
                  <img className='img' src={images.draft_edit_icon}/>
                  编辑
                </div>
                <div className='btn' onClick={(e) => del(e, data)}>
                  <img className='img' src={images.draft_del_icon}/>
                  删除
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})