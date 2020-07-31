import React, {PureComponent} from "react"
import './index.less'
import opacityWrapper from '../../Wrappers/opacityWrapper'
import images from "../../../assets/images";
import NavBar from "../../NavBar";

const Weights = ['normal', 'bold']
const Colors = ['#323232', '#999999', '#E7511A',
  '#D68F50', '#C3A546', '#488D63', '#548BAC', '#A58876', '#FFFAEF']
const Aligns = ['left', 'center', 'right']
const Sizes = [
  {size: 12, text: '小'},
  {size: 14, text: '标准'},
  {size: 16, text: '大'},
  {size: 18, text: '超大'},
]

class EditTextOverlay extends PureComponent {
  state: any
  props: any
  btnRefs: any = {
    color: React.createRef(),
    font: React.createRef()
  }

  constructor(props) {
    super(props)
    // style = fontWeight: "normal", textAlign: "left", fontSize: 16
    const {body='', style = {}} = props.data || {}
    this.state = {
      fontWeight: style.fontWeight,
      color: style.color,
      fontSize: style.fontSize,
      textAlign: style.textAlign,
      text: body,
      selectType: null,
      selectBtnRect: {}
    }
  }

  _showSelect(type) {
    const {selectType: prevType} = this.state
    if (prevType === type) {
      this.setState({selectType: null})
      return
    }
    let rect = this.btnRefs[type].current.getBoundingClientRect()
    this.setState({
      selectBtnRect: rect,
      selectType: type
    })
  }

  _newline = ()=> {
    console.log('newline')
    this.setState(({text}: any)=>({
      text: (text || '') + '\n'
    }))
  }

  _clickColor(color) {
    this.setState({color, selectType: null})
  }

  _clickFont(size) {
    this.setState({fontSize: size, selectType: null})
  }

  _done = () => {
    const {onChange, data} = this.props
    const {text, fontWeight, textAlign, fontSize, color} = this.state
    let style: any = {}
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
        [type]: next,
        selectType: null
      }
    })
  }

  _renderTriangle(rect, top) {
    const triangleWidth = 16
    const triangle2Width = 22
    const triangle3Width = 18
    return [
      // 外部三角形，模拟边框
      <div
        key='out-triangle'
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
      </div>,
      // 把矩形边框挡住的三角形
      <div
        key='in-triangle'
        className='edit-text-triangle'
        style={{
          top: rect.top + rect.height - triangle2Width + top + 3,
          borderWidth: triangle2Width / 2,
          left: rect.left + rect.width / 2 - triangle2Width / 2
        }}
      />
    ]
  }

  _renderFontOverlay() {
    const top = 12
    const {selectBtnRect: rect, selectType} = this.state
    if (selectType !== 'font') return null
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className='edit-text-overlay'
        style={{
          top: rect.top + rect.height + top,
          left: 30
        }}
      >
        <div className='edit-text-colors'>
          {Sizes.map(({size, text}) => (
            <p
              key={text}
              onClick={() => this._clickFont(size)}
              className='edit-text-font'
              style={{fontSize: size}}
            >{text}</p>
          ))}
        </div>
        {this._renderTriangle(rect, top)}
      </div>
    )
  }

  _renderColorOverlay() {
    const top = 12
    const {selectBtnRect: rect, selectType} = this.state
    if (selectType !== 'color') return null
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className='edit-text-overlay'
        style={{
          top: rect.top + rect.height + top,
          left: 30
        }}
      >
        <div className='edit-text-colors'>
          {Colors.map(color => (
            <div
              key={color}
              onClick={() => this._clickColor(color)}
              className='edit-text-color'
              style={{backgroundColor: color}}
            />
          ))}
        </div>
        {this._renderTriangle(rect, top)}
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
    const {onCancel} = this.props
    let alignImg = images.edit_text_left
    if (textAlign === 'right') alignImg = images.edit_text_right
    if (textAlign === 'center') alignImg = images.edit_text_center
    return (
      <div className='add-text-container'>
        <NavBar
          title='编辑文字'
          onBack={onCancel}
          rightButtons={[{
            text: '完成',
            style: {color: '#E97462'},
            onClick: this._done
          }]}
        />

        <div
          onClick={e => e.stopPropagation()}
          className='add-text-wrapper'
        >
          <textarea
            className='add-textarea'
            value={text}
            placeholder='点这里输入文字'
            onChange={e => this.setState({text: e.target.value})}
            style={{
              fontWeight,
              color,
              textAlign,
              fontSize: fontSize + 'px'
            }}
          />
          <div className='add-text-btns'>
            <button
              onClick={() => this.change('fontWeight', Weights)}
              className='add-text-btn'
              style={{
                backgroundImage: `url(${fontWeight === 'normal'
                  ? images.edit_text
                  : images.edit_text_bold})`
              }}
            />
            <button
              ref={this.btnRefs['color']}
              onClick={() => this._showSelect('color')}
              className='add-text-btn'
              style={{backgroundColor: color}}
            />
            <button
              onClick={() => this.change('textAlign', Aligns)}
              className='add-text-btn'
              style={{backgroundImage: `url(${alignImg})`}}
            />
            <button
              ref={this.btnRefs['font']}
              onClick={() => this._showSelect("font")}
              className='add-text-btn'
              style={{backgroundImage: `url(${images.edit_text_size})`}}
            />
            <button
              onClick={this._newline}
              className='add-text-newline'>换行
            </button>
          </div>
        </div>
        {this._renderColorOverlay()}
        {this._renderFontOverlay()}
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)