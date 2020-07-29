import React, {useEffect, useState} from 'react'
import './index.less'
import NavBar from "../../components/NavBar"
import images from "../../assets/images"
import * as utils from "../../utils"
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'

export default pageWrapper()((props) => {
  const {drafts} = props.state.draft
  useEffect(() => {
    props.actions.findDrafts(1)
  }, [])

  return (
    <div>
      <NavBar
        title=''
        backText='主页'
        onBack={() => props.history.goBack()}
      />
      <ul className='drafts-page'>
        {drafts.map((data) => (
          <li
            key={data.draftId}
            onClick={() => props.history.push(`postedit?draftId=${data.draftId}`)}
          >
            {data.title}
          </li>
        ))}
      </ul>
    </div>
  )
})