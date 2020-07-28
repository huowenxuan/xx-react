import React, {PureComponent} from "react"
import './index.less'
import * as utils from '../../../utils/'
import images from "../../../assets/images"
import {compose, pure} from 'recompose'

const EditMediaItem = (props) => {
  const {data, onDelete, onUp, onDown, onClick, onSetCover, isCover} = props
  const _action = (e, func) => {
    e.stopPropagation()
    func && func()
  }

  const _renderText = (item) => {
    const {style = {}, body} = item
    const {fontSize = 16, fontWeight = 'normal', color = '#222', textAlign = 'left'} = style
    const inlineStyle = {
      fontSize: fontSize + 'px',
      fontWeight,
      color,
      textAlign
    }
    return (
      <div className='text-item' style={inlineStyle}>
        {body}
      </div>
    )
  }

  const _renderImage = (item) => {
    const {style = 0, info = {}} = item
    const {width, height} = info
    let scale = 1
    // 旋转后缩放以尽可能适应容器大小
    if (width && height && (style === 90 || style === 270)) {
      scale = width / height
    }
    return (
      <div className='image-box'>
        <img
          className='item-image'
          style={{
            transform: `rotate(${style}deg) scale(${scale}, ${scale})`,
          }}
          src={item.body}
        />
        <div className='image-overlay'/>
      </div>
    )
  }
  const _renderShortVideo = (item) => {
    return (
      <div className='image-box'>
        <video
          controls={true}
          className='item-video'
          src={item.body}
        />
        <div className='image-overlay'/>
      </div>
    )
  }

  const _renderLink = (item) => {
    const {body, data} = item
    return (
      <div className='text-item'>
        <p>{data}</p>
        <p>{body}</p>
      </div>
    )
  }

  const _renderVideo = (item) => {
    return (
      <div className='web-video-box'>
        <iframe
          className='web-video'
          src={utils.getWebVideoUrl(item.body)}
          frameBorder="0"
          width="100%"
          height="100%"
          allowFullScreen
        />
      </div>
    )
  }

  const _renderSetCoverBtn = () => {
    const {type} = data
    if (type !== 'image') return null
    return (
      <button
        className='btn set-cover'
        onClick={isCover ? null : e => this._action(e, onSetCover)}
      >
        {isCover ? '当前封面' : '设为封面'}
      </button>
    )
  }


  const _renderBtns = () => {
    return (
      <div className='btns'>
        <button
          className='btn del'
          onClick={e => _action(e, onDelete)}
        >
          <img className='icon' src={images.edit_remove_icon}/>
        </button>
        <button
          className='btn up'
          onClick={e => _action(e, onUp)}
        >
          <img className='icon' src={images.edit_up_icon}/>
        </button>
        <button
          className='btn down'
          onClick={e => _action(e, onDown)}
        >
          <img className='icon' src={images.edit_down_icon}/>
        </button>
        {_renderSetCoverBtn()}
      </div>
    )
  }

  const _onClick = () => {
    onClick && onClick()
  }

  const {type} = data
  let _renderItem = null
  switch (type) {
    case 'text':
      _renderItem = _renderText(data)
      break
    case 'image':
      _renderItem = _renderImage(data)
      break
    case 'shortvideo':
      _renderItem = _renderShortVideo(data)
      break
    case 'video':
      _renderItem = _renderVideo(data)
      break
    case 'link':
      _renderItem = _renderLink(data)
      break
  }

  return (
    <li
      className='edit-media-item'
      onClick={_onClick}
    >
      {_renderItem}
      {_renderBtns()}
    </li>
  )
}

export default compose(pure)(EditMediaItem)