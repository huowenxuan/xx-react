import React from 'react'
import "../../App.less"

export default (props) => {
  return (
    <div className='fixed' style={props.style}>
      <div className='fixed-wrapper'>
        {props.children}
      </div>
    </div>
  )
}