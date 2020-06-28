import React, {PureComponent} from "react";
import './index.css'

export default class AddItem extends PureComponent {
  constructor(props) {
    super(props)

    this.addActions = [
      {'text': '照片', color: 'black'},
      {'text': '文字', color: 'cyan'},
      {'text': '链接', color: 'pink'},
      {'text': '视频', color: 'yellow'},
    ]
  }

  _renderOpen() {
    const {isOpen, onClick} = this.props
    return (
      <div
        className='add-row-open'
        onClick={onClick}
      >
        {this.addActions.map(({text, color}) => (
          <div
            key={text}
            onClick={() => {
              alert(text)
            }}
            className='add-item'
            style={{backgroundColor: color}}
          >
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
        // className='add-row'
        style={{width: '100%', height: '30px', backgroundColor: isOpen ? 'red' : 'blue'}}
      >
        {isOpen
          ? this._renderOpen()
          : this._renderClose()}
      </div>
    )
  }
}

