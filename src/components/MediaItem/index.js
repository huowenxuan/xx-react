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
    const {style={}, body} = item
    const {fontSize=16, fontWeight='normal', color='#222', textAlign='left'} = style
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
    return <img className='image' src={item.body}/>
  }

  _renderBtns() {
    const {onDelete, onUp, onDown} = this.props
    return (
      <div className='item-btns'>
        <button
          className='item-btn item-btn-del'
          onClick={e=>this._action(e, onDelete)}
        >
          X
        </button>
        <button
          className='item-btn item-btn-up'
          onClick={e=>this._action(e, onUp)}
        >
          ↑
        </button>
        <button
          className='item-btn item-btn-down'
          onClick={e=>this._action(e, onDown)}
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

