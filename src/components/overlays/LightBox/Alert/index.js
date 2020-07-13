import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './index.css'
import TopView from '../../TopView'

export default class Alert extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      buttons: this.props.buttons
    }
  }

  static defaultProps = {
    title: '确定?',
    buttons: [
      {text: '好的', onPress: null,},
      {type: 'cancel', onPress: null},
    ]
  }

  static propTypes = {
    buttons: PropTypes.array.isRequired
  }

  _onButtonPress(onPress) {
    TopView.hideTop()
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
        style={styles.button}
      >
        <p style={{...styles.buttonText, color: textColor || '#1A1A1A'}}>
          {text}
        </p>
      </button>
    )
  }

  _renderButtons(buttons) {
    if (buttons.length === 1) {
      return (
        <div style={styles.buttonGroup}>
          {this._renderOneButton(buttons[0])}
        </div>
      )
    } else if (buttons.length === 2) {
      return (
        <div style={styles.buttonGroup}>
          {this._renderOneButton(buttons[0])}
          <div style={styles.verticalLine}/>
          {this._renderOneButton(buttons[1])}
        </div>
      )
    } else {
      return <p>没做2个以上的</p>
    }
  }

  render() {
    const {title, description, buttons} = this.props

    return (
      <div style={styles.container}>
        <div style={styles.main}>
          <div style={styles.textBox}>
            <p style={styles.title}>{title}</p>
            {description ? <p style={styles.description}>{description}</p> : null}
          </div>

          <div style={styles.line}/>
          {this._renderButtons(buttons)}
        </div>
      </div>
    )
  }
}

let width = '70%'
let styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  main: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  textBox: {
    padding: '34px 20px 26px 20px'
  },
  title: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: '22px',
    color: 'black'
  },
  description: {
    marginTop: 10,
    color: '#030303',
    fontSize: 13,
    lineHeight: '20px',
    textAlign: 'center'
  },
  line: {
    backgroundColor: '#CCCCCC',
    height: 1,
    width: '100%',
    transform: 'scaleY(.5)'
  },
  verticalLine: {
    backgroundColor: '#CCCCCC',
    width: 1,
    height: 44,
    transform: 'scaleX(.5)'
  },
  // 一个或两个button
  buttonGroup: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '44px'
  },
  button: {
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#1A1A1A',
  },
  input: {
    marginLeft: 20,
    width: width - 40,
    height: 30,
    backgroundColor: 'white',
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C7C7C7a0',
    paddingHorizontal: 9,
    paddingVertical: 7,
    fontSize: 14
  }
}