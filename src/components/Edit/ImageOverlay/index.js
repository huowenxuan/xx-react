import React, {PureComponent} from "react"
import './index.css'
import opacityWrapper from '../../Wrappers/opacityWrapper'
import images from "../../../assets/images"

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    // info = format size height width
    // style = 90
    // 后台把style直接设置为旋转角度
    const {body, style} = props.data || {}
    this.state = {
      body,
      rotate: style ? parseInt(style) : 0,
      choose: false
    }
  }

  componentDidMount() {
  }

  _done = () => {
    const {onChange, data} = this.props
    const {rotate, choose} = this.state
    let style = 0
    // 归到0、90、180、270度
    if (rotate) style = (rotate / 90) % 4 * 90
    onChange && onChange({
      ...data,
      type: 'image',
      // 必须转为字符串后台才能修改成功
      style: style.toString(),
      isCover: choose
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
      rotate = 0,
      choose
    } = this.state
    const {onCancel, isCover} = this.props
    return (
      <div
        className='add-image-wrapper'
        onClick={onCancel}
      >
        <div style={{position: 'relative', height: '100%'}}>
          <div className='add-img-box'>
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
            onClick={e => e.stopPropagation()}
          >
            <div className='add-img-bottom-btns'>
              <div
                className='set-cover-btn'
                onClick={isCover ? null : () => this.setState(({choose}) => ({choose: !choose}))}>
                {isCover ? '当前封面' : [
                  <button
                    style={{
                      marginRight: 5,
                      backgroundImage: `url(${images.edit_image_icons})`,
                      backgroundPosition: choose ? '-20px 0' : '0 0'
                    }}
                    className='rotate-btn'>
                  </button>,
                  '设为封面'
                ]}
              </div>
              <button
                style={{backgroundImage: `url(${images.edit_image_icons})`}}
                className='rotate-btn'
                onClick={() => this._rotate(rotate)}>
              </button>
            </div>

            <div className='add-img-confirm-box'>
              <div onClick={onCancel}>取消</div>
              <div onClick={this._done}>确认</div>
              <div className='white-line'/>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)