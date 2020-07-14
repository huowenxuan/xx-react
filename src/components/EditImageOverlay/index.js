import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'

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
  }

  _done = () => {
    const {onChange, data} = this.props
    const {rotate} = this.state
    let style = {}
    // 归到0、90、180、270度
    if (rotate) style.rotate = (rotate / 90) % 4 * 90
    onChange && onChange({
      ...data,
      type: 'image',
      style,
    })
  }

  _rotate(nowRotate) {
    this.setState({
      rotate: nowRotate + 90
    })
  }

  render() {
    const {
      body,
      rotate = 0
    } = this.state
    const {onCancel} = this.props
    return (
      <div
        className='add-image-wrapper'
        onClick={onCancel}
      >
        <div style={{position: 'relative', height: '100%'}}>
          <div className='add-img-box'>
            {/*<div*/}
            {/*  className='add-img'*/}
            {/*  style={{*/}
            {/*    backgroundImage: `url(${body})`,*/}
            {/*    transform: `rotate(${rotate}deg)`*/}
            {/*  }}*/}
            {/*/>*/}
            <img
              className='add-img'
              src={body}
              style={{
                // backgroundImage: `url(${body})`,
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
              <div onClick={()=>this._rotate(rotate)}>
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