import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './index.less'
import TopView from '../../TopView'

export default class Alert extends PureComponent {
  props: any
  state: any

  constructor(props) {
    super(props)

    this.state = {
      buttons: props.buttons
    }
  }

  static defaultProps = {
    title: '确定?',
    description: '',
    buttons: [
      {text: '好的', onPress: null,},
      {type: 'cancel', onPress: null},
    ],
    showClose: false, // 是否显示右上角的关闭按钮
  }

  static propTypes = {
    buttons: PropTypes.array.isRequired
  }

  _hide() {
    TopView.hideTop()
  }

  _onButtonPress(onPress) {
    this._hide()
    onPress && onPress()
  }

  _renderOneButton(data) {
    let {type, textColor, onPress, text} = data
    if (type === 'confirm') {
      text = '确定'
    } else if (type === 'cancel') {
      text = '取消'
      textColor = '#FF4542'
    }
    return (
      <button
        onClick={this._onButtonPress.bind(this, onPress)}
        className='button'
      >
        <p style={{color: textColor || '#1A1A1A'}}>
          {text}
        </p>
      </button>
    )
  }

  _renderButtons(buttons) {
    if (buttons.length === 1) {
      return (
        <div className='button-group'>
          {this._renderOneButton(buttons[0])}
        </div>
      )
    } else if (buttons.length === 2) {
      return (
        <div className='button-group'>
          {this._renderOneButton(buttons[0])}
          <div className='vertical-line'/>
          {this._renderOneButton(buttons[1])}
        </div>
      )
    } else {
      return <p>没做2个以上的</p>
    }
  }

  render() {
    const {title, description, buttons, showClose} = this.props

    return (
      <div className='alert'>
        <div className='main'>
          <div className='text-box'>
            <p className='title'>{title}</p>
            {description ? <p className='description'>{description}</p> : null}
          </div>

          <div className='line'/>
          {this._renderButtons(buttons)}

          {showClose ? <div
            className='close'
            onClick={this._hide}
          ><p className='child'>×</p></div> : null}
        </div>
      </div>
    )
  }
}

