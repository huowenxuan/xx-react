import React, {PureComponent} from "react";
import './index.css'

export default class AddItem extends PureComponent {
  constructor(props) {
    super(props)
    const {onImage, onText, onLink, onVideo, isOpen} = props
    this.addActions = [
      {text: '照片', color: 'green', action: onImage},
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
        style={{opacity: isOpen ? 1 : 0, zIndex: isOpen ? 1 : 0}}
      >
        {this.addActions.map(({text, color, action}) => (
          <div
            className='add-item'
            key={text}
            onClick={action}
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
        className='add-row-close'
        onClick={onClick}
        style={{opacity: isOpen ? 0 : 1, zIndex: isOpen ? 0 : 1}}
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
        // style={{backgroundColor: isOpen ? 'red' : 'blue'}}
      >
        {this._renderOpen()}
        {this._renderClose()}
      </div>
    )
  }
}

