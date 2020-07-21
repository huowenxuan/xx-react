import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './index.less'

export default class ActionSheet extends PureComponent {
  props: any

  constructor(props) {
    super(props)

    this.state = {
      buttons: props.buttons
    }
  }

  static defaultProps = {
    buttons: [],
    onDismiss: () => {
    }
  }

  static propTypes = {
    buttons: PropTypes.array.isRequired
  }

  _renderOneButton(data) {
    return (
      <button
        onClick={() => this._onButtonPress(data.onPress)}
        className='button'
        style={{color: data.textColor || '#191919'}}
      >
        {data.text}
      </button>
    )
  }

  _onButtonPress(onPress) {
    this._dismiss()
    onPress && onPress()
  }

  _dismiss = () => {
    // Router.dismissLightBox()
    const {onDismiss} = this.props
    onDismiss && onDismiss()
  }

  render() {
    const {buttons} = this.props
    return (
      <div className='action-sheet'>
        <div
          className='blank'
          onTouchStart={this._dismiss}
          onClick={this._dismiss}
        />
        <div>
          <div>
            {buttons.map((button, i) => (
              <div key={i}>
                <div className='button-box'>
                  {this._renderOneButton(button)}
                </div>
                <div className='line'/>
              </div>
            ))}
          </div>

          <div className='button-box cancel'>
            {this._renderOneButton({text: '取消'})}
          </div>
        </div>
      </div>
    )
  }
}

