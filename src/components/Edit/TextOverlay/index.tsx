import React, {PureComponent, createRef, useState, useEffect} from "react"
import './index.less'
import images from "../../../assets/images"
import NavBar from "../../NavBar"
import Fixed from "../../Fixed"
import overlays from '../../overlays/'

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

export default (props) => {
  const {onChange, data, onCancel} = props
  const {body = '', style = {}} = data || {}
  const btnRefs: any = {
    color: createRef(),
    font: createRef()
  }

  const [fontWeight, setFontWidth] = useState(style.fontWeight)
  const [color, setColor] = useState(style.color)
  const [fontSize, setFontSizes] = useState(style.fontSize)
  const [textAlign, setTextAlign] = useState(style.textAlign)
  const [text, setText] = useState(body)
  const [selectType, setSelectType] = useState(null)
  const [selectBtnRect, setSelectBtnRect] = useState(null)
  const [isUpdate, setIsUpdate] = useState(false) // 是否更新过
  const [isInit, setInit] = useState(true) // 是否初始化完成，在useEffect中判断是更新还是初始化

  useEffect(() => {
    if (isInit)
      return setInit(false)
    setIsUpdate(true)
    console.log('更新过')
  }, [text, fontWeight, fontSize, color, textAlign])

  const _showSelect = (type) => {
    if (selectType === type) {
      setSelectType(null)
      return
    }
    let rect = btnRefs[type].current.getBoundingClientRect()
    setSelectBtnRect(rect)
    setSelectType(type)
  }

  const _newline = () => setText((prevText) => (prevText || '') + '\n')

  const _clickColor = (color) => {
    setSelectType(null)
    setColor(color)
  }

  const _clickFont = (size) => {
    setFontSizes(size)
    setSelectType(null)
  }

  const _done = () => {
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

  const _back = () => {
    const back = () => onCancel && onCancel()
    if (isUpdate) {
      overlays.showAlert('是否保存更新?', '', [
        {
          text: '保存', onPress: () => {
            _done()
            back()
          }
        },
        {text: '放弃', onPress: back},
      ])
    } else {
      back()
    }
  }

  const change = (type, all, setFn) => {
    let index = all.indexOf(type)
    let next
    if (index === -1) next = all[1]
    else if (index === all.length - 1) next = all[0]
    else next = all[index + 1]
    setFn(next)
    setSelectType(null)
  }

  const _renderTriangle = (rect, top) => {
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
        />
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

  const _renderFontOverlay = () => {
    const top = 12
    let rect = selectBtnRect
    if (selectType !== 'font') return null
    return (
      <Fixed>
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
                onClick={() => _clickFont(size)}
                className='edit-text-font'
                style={{fontSize: size}}
              >{text}</p>
            ))}
          </div>
          {_renderTriangle(rect, top)}
        </div>
      </Fixed>
    )
  }
  const _renderColorOverlay = () => {
    const top = 12
    let rect = selectBtnRect
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
              onClick={() => _clickColor(color)}
              className='edit-text-color'
              style={{backgroundColor: color}}
            />
          ))}
        </div>
        {_renderTriangle(rect, top)}
      </div>
    )
  }

  let alignImg = images.edit_text_left
  if (textAlign === 'right') alignImg = images.edit_text_right
  if (textAlign === 'center') alignImg = images.edit_text_center
  let defaultColor = '#222'
  return (
    <div className='add-text-container'>
      <NavBar
        title='编辑文字'
        onBack={_back}
        rightButtons={[{
          text: '完成',
          style: {color: '#E97462'},
          onClick: _done
        }]}
      />

      <div
        onClick={e => e.stopPropagation()}
        className='add-text-wrapper'
      >
          <textarea
            className='add-textarea'
            autoFocus={!text}
            value={text}
            placeholder='点这里输入文字'
            onChange={e => setText(e.target.value)}
            style={{
              fontWeight: fontWeight || Weights[0],
              color: color || defaultColor,
              textAlign: textAlign || 'left',
              fontSize: (fontSize || 16) + 'px'
            }}
          />
        <div className='add-text-btns'>
          <button
            onClick={() => change(fontWeight, Weights, setFontWidth)}
            className='add-text-btn'
            style={{
              backgroundImage: `url(${fontWeight === 'normal'
                ? images.edit_text
                : images.edit_text_bold})`
            }}
          />
          <button
            ref={btnRefs['color']}
            onClick={() => _showSelect('color')}
            className='add-text-btn'
            style={{backgroundColor: color || defaultColor}}
          />
          <button
            onClick={() => change(textAlign, Aligns, setTextAlign)}
            className='add-text-btn'
            style={{backgroundImage: `url(${alignImg})`}}
          />
          <button
            ref={btnRefs['font']}
            onClick={() => _showSelect("font")}
            className='add-text-btn'
            style={{backgroundImage: `url(${images.edit_text_size})`}}
          />
          <button
            onClick={_newline}
            className='add-text-newline'>换行
          </button>
        </div>
      </div>
      {_renderColorOverlay()}
      {_renderFontOverlay()}
    </div>
  )
}

