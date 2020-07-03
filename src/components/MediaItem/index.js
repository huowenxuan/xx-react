import React, {PureComponent} from "react";
import './index.css'

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
      <div
        className='image-box'
      >
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

  render() {
    const {data, onClick} = this.props
    const {type} = data
    let _renderItem = null
    switch (type) {
      case 'text':
        _renderItem = this._renderText(data)
        break
      case 'image':
        _renderItem = this._renderImage(data)
    }
    return (
      <li
        className='item'
        onClick={onClick}
      >
        {_renderItem}
        {this._renderBtns()}
      </li>
    )
  }
}

