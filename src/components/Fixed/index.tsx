import React from 'react'
import "../../App.less"

export default (props) => {
  return (
    <div className='fixed'>
      <div className='fixed-wrapper'>
        {props.children}
      </div>
    </div>
  )
}