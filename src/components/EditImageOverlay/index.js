import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'

const Weights = ['normal', 'bold']
const Colors = ['#222', 'red']
const Aligns = ['left', 'center', 'right']
const Sizes = ['16', '20', '13']


class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    // info= format size height width
    // style= rotate:90
    const {body, info = {}, style = {}} = props.data || {}
    this.state = {
      body,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      console.log(this.props.data)
    }, 500)
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
      type: 'image',
      body: text,
      style,
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
      body,
      fontWeight = Weights[0],
      color = '#222',
      fontSize = '16',
      textAlign = 'left'
    } = this.state
    const {onCancel} = this.props
    console.log(body)
    return (
      <div
        className='add-image-wrapper'
        onClick={onCancel}
      >
        <img
          className='add-img'
          src={body}
        />
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)