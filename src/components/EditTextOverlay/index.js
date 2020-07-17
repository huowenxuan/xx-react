import React, {PureComponent} from "react"
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'

const Weights = ['normal', 'bold']
const Colors = ['#323232', '#999999', '#E7511A',
  '#D68F50', '#C3A546', '#488D63', '#548BAC', '#A58876', '#FFFAEF']
const Aligns = ['left', 'center', 'right']
const Sizes = ['16', '20', '13']

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    // style = fontWeight: "normal", textAlign: "left", fontSize: 16
    const {body, style = {}} = props.data || {}
    this.state = {
      fontWeight: style.fontWeight,
      color: style.color,
      fontSize: style.fontSize,
      textAlign: style.textAlign,
      text: body || '',
      colorRect: {},
      colorShow: false
    }

    this.colorBtn = React.createRef()
    this.sizeBtn = React.createRef()
  }

  componentDidMount() {
  }

  _showColors = ()=> {
    let rect = this.colorBtn.current.getBoundingClientRect()
    this.setState({
      colorRect: rect,
      colorShow: true
    })
  }

  _clickColor(color) {
    this.setState({
      color,
      colorShow: false
    })
  }

  _done = () => {
    const {onChange, data} = this.props
    const {text, fontWeight, textAlign, fontSize, color} = this.state
    let style = {}
    if (fontWeight) style.fontWeight = fontWeight
    if (textAlign) style.textAlign = textAlign
    if (fontSize) style.fontSize = fontSize
    if (color) style.color = color
    onChange && onChange({
      ...data,
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

  _renderColorOverlay() {
    const triangleWidth = 16
    const triangle2Width = 22
    const triangle3Width = 18
    const top = 12
    const {colorRect: rect, colorShow} = this.state
    if (!colorShow) return null
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className='edit-text-overlay'
        style={{
          top: rect.top + rect.height + top,
          left: 30
        }}
      >
        <div
          className='edit-text-colors'
        >
          {Colors.map(color => (
            <div
              key={color}
              onClick={()=>this._clickColor(color)}
              className='edit-text-color'
              style={{backgroundColor: color}}
            />
          ))}
        </div>
        {/* 外部三角形，模拟边框 */}
        <div
          className='edit-text-triangle'
          style={{
            top: rect.top + rect.height - triangle3Width + top,
            borderWidth: triangle3Width / 2,
            borderColor: 'transparent transparent #d5d5d588 transparent',
            left: rect.left + rect.width / 2 - triangle3Width / 2
          }}
        >
          {/* 内部白色三角形 */}
          <div
            className='edit-text-triangle'
            style={{
              top: rect.top + rect.height - triangleWidth + top,
              borderWidth: triangleWidth / 2,
              left: rect.left + rect.width / 2 - triangleWidth / 2
            }}
          >
          </div>
        </div>
        {/* 把矩形边框挡住的三角形 */}
        <div
          className='edit-text-triangle'
          style={{
            top: rect.top + rect.height - triangle2Width + top + 3,
            borderWidth: triangle2Width / 2,
            left: rect.left + rect.width / 2 - triangle2Width / 2
          }}
        />
      </div>
    )
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
              <button
                onClick={() => this.change('fontWeight', Weights)}
                className='add-text-left-btn'
              >
                粗细
              </button>
              <button
                ref={this.colorBtn}
                onClick={this._showColors}
                // onClick={() => this.change('color', Colors)}
                className='add-text-left-btn'
              >
                颜色
              </button>
              <button
                onClick={() => this.change('textAlign', Aligns)}
                className='add-text-left-btn'
              >
                居中
              </button>
              <button
                onClick={() => this.change('fontSize', Sizes)}
                className='add-text-left-btn'
              >
                大小
              </button>
            </div>
            <div onClick={this._done}>
              <p>完成</p>
            </div>
          </div>
        </div>
        {this._renderColorOverlay()}
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)