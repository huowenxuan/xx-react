'use strict'

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './index.css'

const windowHeight = window.screen.height
const windowWidth = window.screen.width
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
          color: data.textColor || '#0076FF'
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
      <div className='container'>
        <div style={{flex: 1}} onClick={this._dismiss}/>
        <div>
          <div style={styles.main}>
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
  main: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
  },
  line: {
    backgroundColor: '#D8D8D8',
    height: 0.5,
    width: windowWidth
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cancelButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    margin: '0 10px 10px 10px'
  },
  button: {
    height: 50,
    textAlign: 'center',
    width: '100%',
    fontSize: 17,
    color: '#0076FF',
  }
}