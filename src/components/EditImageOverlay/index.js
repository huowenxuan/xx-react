import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'

const Rotates = ['0', '90', '180', '270']

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    // info= format size height width
    // style= rotate:90
    const {body, style = {}} = props.data || {}
    const {rotate} = style
    this.state = {
      body,
      rotate
    }
  }

  componentDidMount() {
    setTimeout(() => {
      console.log(this.props.data)
    }, 500)
  }

  _done = () => {
    const {onChange, data} = this.props
    const {rotate} = this.state
    let style = {}
    if (rotate) style.rotate = rotate
    onChange && onChange({
      ...data,
      type: 'image',
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
      rotate = Rotates[0],
    } = this.state
    const {onCancel} = this.props
    return (
      <div
        className='add-image-wrapper'
        onClick={onCancel}
      >
        <div style={{position: 'relative', height: '100%'}}>
          <div className='add-img-box'>
            <div
              className='add-img'
              style={{
                backgroundImage: `url(${body})`,
                transform: `rotate(${rotate}deg)`
              }}
            />
          </div>

          <div
            className='add-img-bottom'
            onClick={e=>e.stopPropagation()}
          >
            <div className='add-img-bottom-btns'>
              <div>

              </div>
              <div onClick={()=>this.change('rotate', Rotates)}>
                旋转
              </div>
            </div>

            <div className='add-img-confirm-box'>
              <div onClick={onCancel}>
                取消
              </div>
              <div onClick={this._done}>
                确认
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)