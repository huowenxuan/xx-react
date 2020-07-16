import React from 'react'
import {withStateHandlers, compose, pure} from "recompose"
import './index.css'
import NavBar from "../../components/NavBar"

const PostNew = () => {
  return (
    <div>
      <NavBar
        title=''
      />
      哈哈
    </div>
  )
}

export default compose(pure)(PostNew)