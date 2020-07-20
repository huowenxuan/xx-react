import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../../Wrappers/opacityWrapper'
import NavBar from "../../NavBar";
import * as utils from '../../../utils/'
import overlays from '../../overlays/'

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    const {body, data} = props.data || {}
    this.state = {
      text: body || '',
      url: data || ''
    }
  }

  componentDidMount() {
  }

  _done = () => {
    const {onChange, data} = this.props
    const {url, text} = this.state
    if (!url) {
      overlays.showToast('请输入网址')
      return
    }
    if (!text) {
      overlays.showToast('请输入文字')
      return
    }
    if (!utils.checkUrl(url)) {
      overlays.showToast('请输入正确的网址')
      return
    }
    onChange && onChange({
      ...data,
      type: 'link',
      data: url,
      body: text,
    })
  }

  render() {
    const {url, text} = this.state
    const {onCancel} = this.props
    return (
      <div className='add-link-wrapper'>
        <NavBar
          title='网址链接'
          onBack={onCancel}
          rightButtons={[
            {
              text: '确定',
              textStyle: {color: '#E97462'},
              onClick: this._done
            }
          ]}
        />

        <div className='add-link-container'>
          <input
            className='input-link-url'
            placeholder='添加网址(如:https://www.baidu.com)'
            value={url}
            onChange={e => this.setState({url: e.target.value})}
          />
          <input
            className='input-link-url'
            placeholder='显示文字(如:百度)'
            value={text}
            onChange={e => this.setState({text: e.target.value})}
          />
        </div>
      </div>

    )
  }
}

export default opacityWrapper(EditTextOverlay)