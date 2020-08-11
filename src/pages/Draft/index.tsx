import React, {useEffect, useState} from 'react'
import './index.less'
import NavBar from "../../components/NavBar"
import images from "../../assets/images"
import * as utils from "../../utils"
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'

export default pageWrapper()((props) => {
  const {drafts} = props.state.draft
  useEffect(() => {
    props.actions.findDrafts(props.user.userId)
  }, [props.user])

  return (
    <div className='drafts-page'>
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
            onClick={() => props.history.toEdit({
              draftId: data.draftId
            })}
          >
            <div className='title-row'>
              {/* TODO 占位图 */}
              <img className='img' src={data.headbacimgurl}/>
              {data.title}
            </div>
            <div className='line'/>
            <div className='action-row'>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})