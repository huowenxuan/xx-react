import React, {PureComponent} from "react"
import './index.less'
import NavBar from "../../NavBar"
import * as utils from '../../../utils/'
import overlays from '../../overlays/'

export default class EditTextOverlay extends PureComponent {
  props: any
  state: any

  constructor(props) {
    super(props)
    const {body = '', data = ''} = props.data || {}
    this.state = {
      text: body,
      url: data
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
      <div className='edit-line-overlay'>
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

        <div className='main'>
          <input
            className='input'
            placeholder='添加网址(如:https://www.tangshui.net/)'
            value={url}
            onChange={e => this.setState({url: e.target.value})}
          />
          <input
            className='input'
            placeholder='显示文字(如:糖水官网)'
            value={text}
            onChange={e => this.setState({text: e.target.value})}
          />
        </div>
      </div>
    )
  }
}
