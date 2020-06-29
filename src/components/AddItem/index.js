import React, {PureComponent} from "react";
import './index.css'

export default class AddItem extends PureComponent {
  constructor(props) {
    super(props)
    const {onImage, onText, onLink, onVideo} = props
    this.addActions = [
      {text: '照片', color: 'green', action: onImage, type: 'file'},
      {text: '文字', color: 'cyan', action: onText},
      {text: '链接', color: 'pink', action: onLink},
      {text: '视频', color: 'yellow', action: onVideo},
    ]
  }

  _renderOpen() {
    const {isOpen, onClick} = this.props
    return (
      <div
        className='add-row-open'
        onClick={onClick}
      >
        {this.addActions.map(({text, color, action}) => (
          <div
            className='add-item'
            key={text}
            onClick={action}
            style={{backgroundColor: color}}
          >
            <p>icon</p>
            {text}
          </div>
        ))}
      </div>
    )
  }

  _renderClose() {
    const {isOpen, onClick} = this.props

    return (
      <div
        className='all-row-close'
        onClick={onClick}
      >
        打开
      </div>
    )
  }

  render() {
    const {isOpen, onClick} = this.props
    return (
      <div
        className='add-row'
        style={{backgroundColor: isOpen ? 'red' : 'blue'}}
      >
        {isOpen
          ? this._renderOpen()
          : this._renderClose()}
      </div>
    )
  }
}

