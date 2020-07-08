import React, {PureComponent} from "react";
import './index.css'
import * as utils from '../../utils/'

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
    const {style = {}, info = {}} = item
    const {rotate = 0} = style
    const {width, height} = info
    let scale = 1
    // 旋转后缩放以尽可能适应容器大小
    if (width && height && (rotate === 90 || rotate === 270)) {
      scale =  width / height
    }
    return (
      <div className='image-box'>
        <img
          className='image'
          style={{
            transform: `rotate(${rotate}deg) scale(${scale}, ${scale})`,
          }}
          src={item.body}
        />
      </div>
    )
  }

  _renderSortVideo(item) {
    return (
      <div className='image-box'>
        <video
          controls={true}
          className='video'
          src={item.body}
        />
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

  _renderBtns() {
    const {onDelete, onUp, onDown} = this.props
    return (
      <div className='item-btns'>
        <button
          className='item-btn item-btn-del'
          onClick={e => this._action(e, onDelete)}
        >
          X
        </button>
        <button
          className='item-btn item-btn-up'
          onClick={e => this._action(e, onUp)}
        >
          ↑
        </button>
        <button
          className='item-btn item-btn-down'
          onClick={e => this._action(e, onDown)}
        >
          ↓
        </button>
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

