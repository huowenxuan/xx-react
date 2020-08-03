import React, {PureComponent} from "react"
import './index.less'
import opacityWrapper from '../../Wrappers/opacityWrapper'
import images from "../../../assets/images"

class EditImageOverlay extends PureComponent {
  props: any
  state: any

  constructor(props) {
    super(props)
    // info = format size height width
    // style = 90
    // 后台把style直接设置为旋转角度
    const {body = '', style = ''} = props.data || {}
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
        className='edit-image-overlay'
        onClick={onCancel}
      >
        <div className='main'>
          <div className='img-box'>
            <img
              className='img'
              src={body}
              style={{transform: `rotate(${rotate}deg)`}}
            />
          </div>

          <div
            className='bottom'
            onClick={e => e.stopPropagation()}
          >
            <div className='btns'>
              <div
                className='set-cover'
                onClick={isCover ? null : () => this.setState(({choose}: any) => ({choose: !choose}))}>
                {isCover ? '当前封面' : [
                  <button
                    key='image-overlay-set-cover-btn'
                    style={{
                      marginRight: 5,
                      backgroundImage: `url(${images.edit_image_icons})`,
                      backgroundPosition: choose ? '-20px 0' : '0 0'
                    }}
                    className='rotate-btn'>
                  </button>,
                  <p key='image-overlay-set-cover-p'>设为封面</p>
                ]}
              </div>
              <button
                style={{backgroundImage: `url(${images.edit_image_icons})`}}
                className='rotate-btn'
                onClick={() => this._rotate(rotate)}>
              </button>
            </div>

            <div className='confirm-box'>
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

export default opacityWrapper(EditImageOverlay)