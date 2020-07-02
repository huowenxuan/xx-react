import React, {PureComponent} from "react";
import './index.css'

const Duration = 300
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
    this.state = {
      openOpacity: 0,
      closeOpacity: 1,
      openDisplay: false,
      closeDisplay: true,
    }
  }

  open = () => {
    this.setState({
      closeDisplay: true,
      openDisplay: true,
    })
    setTimeout(() => {
      this.setState({
        openOpacity: 1,
        closeOpacity: 0,
      })
    })
    setTimeout(() => {
      this.setState({
        closeDisplay: false
      })
    }, Duration)
  }

  close() {
    this.setState({
      closeDisplay: true,
      openDisplay: true,
    })
    setTimeout(() => {
      this.setState({
        openOpacity: 0,
        closeOpacity: 1,
      })
    })

    setTimeout(() => {
      this.setState({
        openDisplay: false,
      })
    }, Duration)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {isOpen} = nextProps
    if (isOpen !== this.props.isOpen) {
      if (isOpen) this.open()
      else this.close()
    }
  }

  _renderOpen() {
    const {onClick} = this.props
    const {openOpacity, openDisplay} = this.state
    let style = {
      opacity: openOpacity,
      transition: `opacity ${Duration}ms ease-out`
    }
    if (!openDisplay) style.display = 'none'
    return (
      <div
        className='add-row-open'
        onClick={onClick}
        style={style}
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
    const {onClick} = this.props
    const {closeOpacity, closeDisplay} = this.state
    let style = {opacity: closeOpacity, transition: `opacity ${Duration}ms ease-out`}
    if (!closeDisplay) style.display = 'none'
    return (
      <div
        className='add-row-close'
        onClick={onClick}
        style={style}
      >
        打开
      </div>
    )
  }

  render() {
    return (
      <div
        className='add-row'
      >
        {this._renderOpen()}
        {this._renderClose()}
      </div>
    )
  }
}

