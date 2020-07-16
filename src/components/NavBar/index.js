import React, {PureComponent} from "react"
import './index.css'
import PropTypes from 'prop-types'
import images from '../../assets/images'

export default class NavBar extends PureComponent {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    leftButtons: PropTypes.array,
    rightButtons: PropTypes.array,
    title: PropTypes.string,
    onBack: PropTypes.func,
    backText: PropTypes.string,
  }

  static defaultProps = {
    leftButtons: null, // 如果是null、undefined就显示返回按钮、[]都不显示，默认显示
    rightButtons: [{text: 'fff'},{text: 'fff'},],
    title: '',
    backText: '返回'
  }

  backButton() {
    const {onBack, backText} = this.props
    return [{
      custom: (
        <div className='nav-center nav-button'>
            <img className='back-button-img' src={images.back_left}/>
          {backText}
        </div>
      ),
      onClick: () => onBack
        ? onBack()
        // : Router.pop()
        : () => {
        }
    }]
  }

  _isEnglishChar(char) {
    let charCode = char.charCodeAt(0)
    return charCode >= 0 && charCode <= 128
  }

  _showTitle(title) {
    title = title || ''
    let length = 0
    let stopIndex = -1
    for (let i = 0; i < title.length; i++) {
      if (this._isEnglishChar(title[i])) {
        length += 1
      } else {
        length += 2
      }

      if (length >= 28) {
        stopIndex = i
        break
      }
    }

    if (stopIndex > -1) {
      return title.substr(0, stopIndex) + '…'
    } else {
      return title
    }
  }

  _renderButton(data, key) {
    if (!data) return null

    let button
    if (data.text) {
      button = (
        <div className='nav-button nav-center text-button' style={data.style}>
          <div className='button-text' style={data.textStyle}>
            {data.text}
          </div>
        </div>
      )
    } else if (data.icon) {
      button = (
        <div className='nav-button nav-center icon-button' style={data.style}>
          {data.icon}
        </div>
      )
    } else {
      button = data.custom
    }

    return (
      <button
        onClick={data.onClick}
        key={key}
        className='nav-center'
      >
        {button}
      </button>
    )
  }

  _renderButtons(buttons, style) {
    return (
      <div className='nav-center' style={style}>
        {buttons
          ? buttons.map((item, idx) => this._renderButton(item, idx))
          : null}
      </div>
    )
  }

  _renderNavBar(navHeight) {
    const {title, leftButtons, rightButtons, style, titleView} = this.props
    return (
      <nav style={{height: navHeight, ...style}} className='nav-wrapper'>
        <div className='title-box'>
          <div style={{pointerEvents: 'auto'}}>
            {titleView || <p className='title'>
              {this._showTitle(title)}
            </p>}
          </div>
        </div>

        {this._renderButtons(leftButtons || this.backButton())}
        {this._renderButtons(rightButtons)}
      </nav>
    )
  }

  render() {
    const navHeight = 47
    return (
      <div>
        {/* 浮动的nav */}
        {this._renderNavBar(navHeight)}
        {/* 撑开navbar的高度，让其他元素不占据navbar的位置 */}
        <div style={{height: navHeight}}/>
      </div>
    )
  }
}

