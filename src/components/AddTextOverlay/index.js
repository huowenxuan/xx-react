import React, {PureComponent} from "react";
import './index.css'

const Weights = ['normal', 'bold']
const Colors = ['#222', 'red']
const Aligns = ['left', 'center', 'right']
const Sizes = ['16', '20', '13']

export default class AddTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    // style = fontWeight: "normal", textAlign: "left", fontSize: 16
    const {body, style = {}} = props.data || {}
    this.state = {
      fontWeight: style.fontWeight,
      color: style.color,
      fontSize: style.fontSize,
      textAlign: style.textAlign,
      text: body || ''
    }
  }

  componentDidMount() {
    console.log(this.props.data)
  }

  _done = () => {
    const {onChange} = this.props
    const {text, fontWeight, textAlign, fontSize, color} = this.state
    let style = {}
    if (fontWeight) style.fontWeight = fontWeight
    if (textAlign) style.textAlign = textAlign
    if (fontSize) style.fontSize = fontSize
    if (color) style.color = color
    onChange && onChange({
      type: 'text',
      body: text,
      style
    })
  }

  change = (type, all) => {
    this.setState((preState) => {
      let cur = preState[type]
      let index = all.indexOf(cur)
      let next
      if (index === -1) next = all[1]
      else if (index === all.length - 1) next = all[0]
      else next = all[index + 1]

      return {
        [type]: next
      }
    })
  }

  render() {
    const {
      text,
      fontWeight = Weights[0],
      color = '#222',
      fontSize = '16',
      textAlign = 'left'
    } = this.state
    return (
      <div
        onClick={this._done}
        className='add-text-wrapper'
      >
        <div onClick={e => e.stopPropagation()}>
        <textarea
          className='add-textarea'
          value={text}
          onChange={e => this.setState({text: e.target.value})}
          style={{
            fontWeight,
            color,
            textAlign,
            fontSize: fontSize + 'px'
          }}
        />
          <div className='add-text-btns'>
            <div className='add-text-left-btns'>
              <div
                onClick={() => this.change('fontWeight', Weights)}
                className='add-text-left-btns'
              >
                粗细
              </div>
              <div
                onClick={() => this.change('color', Colors)}
                className='add-text-left-btns'
              >
                颜色
              </div>
              <div
                onClick={() => this.change('textAlign', Aligns)}
                className='add-text-left-btns'
              >
                居中
              </div>
              <div
                onClick={() => this.change('fontSize', Sizes)}
                className='add-text-left-btns'
              >
                大小
              </div>
            </div>
            <div onClick={this._done}>
              <p>完成</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

