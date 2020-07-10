import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'
import NavBar from '../NavBar/'
import * as utils from '../../utils/'
import overlays from '../overlays'

const tutorialUrl = 'http://static.tangshui.net/tangshui_qqyouku.jpeg'

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    const {body} = props.data || {}
    this.state = {
      body
    }
  }

  componentDidMount() {
  }

  _done = () => {
    const {onChange, data} = this.props
    const {body} = this.state
    if (!body) {
      overlays.showToast('请输入视频链接')
      return
    }
    if (!utils.checkUrl(body)) {
      overlays.showToast('请输入正确的链接')
      return
    }
    onChange && onChange({
      ...data,
      type: 'video',
      body,
    })
  }

  render() {
    const {body} = this.state
    const {onCancel} = this.props
    return (
      <div className='web-video-wrapper'>
        <NavBar
          title='视频链接'
          onBack={onCancel}
        />

        <div className='web-video-container'>
          <input
            className='input'
            placeholder='输入或粘贴视频链接（腾讯视频、优酷视频）'
            value={body || ''}
            onChange={(v) => this.setState({body: v.target.value})}
          />
          <div className='web-video-btns'>
            <button
              className='web-video-btn web-video-btn-clear'
              onClick={() => {
              this.setState({body: ''})
            }}>
              清空
            </button>
            <button
              className='web-video-btn web-video-btn-confirm'
              onClick={this._done}>
              确定
            </button>
          </div>

        </div>

        <img
          src={tutorialUrl}
          style={{width: '100%'}}
        />
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)