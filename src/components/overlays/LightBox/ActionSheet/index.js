import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './index.css'

export default class ActionSheet extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      buttons: this.props.buttons
    }
  }

  static defaultProps = {
    buttons:[]
  }

  static propTypes = {
    buttons: PropTypes.array.isRequired
  }

  _renderOneButton(data) {
    return (
      <button
        onClick={() => this._onButtonPress(data.onPress)}
        style={{
          ...styles.button,
          color: data.textColor || '#191919'
        }}
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
      <div className='actionsheet-container'>
        <div
          style={{flex: 1}}
          onTouchStart={this._dismiss}
          onClick={this._dismiss}/>
        <div>
          <div>
            {buttons.map((button, i) => (
              <div key={i}>
                <div style={styles.buttonBox}>
                  {this._renderOneButton(button)}
                </div>
                <div style={styles.line}/>
              </div>
            ))}
          </div>

          <div style={styles.cancelButtonBox}>
            {this._renderOneButton({text: '取消'})}
          </div>

        </div>
      </div>
    )
  }
}

let styles = {
  line: {
    backgroundColor: '#F8F8F8',
    height: 1,
    width: '100%'
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingTop: 10,
  },
  button: {
    height: 40,
    textAlign: 'center',
    width: '100%',
    fontSize: 12,
    color: '#191919',
    backgroundColor: 'white'
  }
}