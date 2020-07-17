import React, {PureComponent} from "react";
import './index.css'
import * as utils from '../../utils/'
import images from "../../assets/images"

export default class MediaItem extends PureComponent {
  constructor(props) {
    super(props)
  }

  _action(e, func) {
    e.stopPropagation()
    func && func()
  }

  _renderText(item) {
    const {style = {}, body} = item
    const {fontSize = 16, fontWeight = 'normal', color = '#222', textAlign = 'left'} = style
    return (
      <div className='text-item'>
        <p
          className='text'
          style={{
            fontSize: fontSize + 'px',
            fontWeight,
            color,
            textAlign
          }}
        >
          {item.body}
        </p>
      </div>
    )
  }

  _renderImage(item) {
    const {style=0, info = {}} = item
    const {width, height} = info
    let scale = 1
    // 旋转后缩放以尽可能适应容器大小
    if (width && height && (style === 90 || style === 270)) {
      scale =  width / height
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

  _renderSortVideo(item) {
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

  _renderLink(item) {
    const {body, data} = item
    return (
      <div className='text-item'>
        <p>{data}</p>
        <p>{body}</p>
      </div>
    )
  }

  _renderVideo(item) {
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

  _renderSetCoverBtn() {
    const {data} = this.props
    const {onDelete, onUp, onDown, onSetCover, isCover} = this.props
    const {type} = data
    if (type !== 'image') return null
    return (
      <button
        className='item-btn item-btn-set-cover'
        onClick={isCover ? null : e => this._action(e, onSetCover)}
      >
        {isCover ? '当前封面' : '设为封面'}
      </button>
    )

  }
  _renderBtns() {
    const {onDelete, onUp, onDown} = this.props
    return (
      <div className='item-btns'>
        <button
          className='item-btn item-btn-del'
          onClick={e => this._action(e, onDelete)}
        >
          <img className='item-icon-del' src={images.edit_remove_icon}/>
        </button>
        <button
          className='item-btn item-btn-up'
          onClick={e => this._action(e, onUp)}
        >
          <img className='item-icon' src={images.edit_up_icon}/>
        </button>
        <button
          className='item-btn item-btn-down'
          onClick={e => this._action(e, onDown)}
        >
          <img className='item-icon' src={images.edit_down_icon}/>
        </button>
        {this._renderSetCoverBtn()}
      </div>
    )
  }

  _onClick = ()=> {
    const {data, onClick} = this.props
    onClick && onClick()
  }

  render() {
    const {data} = this.props
    const {type} = data
    let _renderItem = null
    switch (type) {
      case 'text':
        _renderItem = this._renderText(data)
        break
      case 'image':
        _renderItem = this._renderImage(data)
        break
      case 'sortvideo':
        _renderItem = this._renderSortVideo(data)
        break
      case 'video':
        _renderItem = this._renderVideo(data)
        break
      case 'link':
        _renderItem = this._renderLink(data)
        break
    }
    return (
      <li
        className='item'
        onClick={this._onClick}
      >
        {_renderItem}
        {this._renderBtns()}
      </li>
    )
  }
}

