import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'
import NavBar from '../NavBar/'

class EditTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    const {body} = props.data || {}
    this.state = {
      body
    }
  }

  componentDidMount() {
    setTimeout(() => {
      console.log(this.props.data)
    }, 500)
  }

  _done = () => {
    const {onChange, data} = this.props
    const {body} = this.state
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
          rightButtons={[
            {text: '确定', textStyle: {color: 'red'}}
          ]}
        />

        <div className='web-video-container'>
          <input
            className='input'
            placeholder='输入或粘贴视频链接（腾讯视频、优酷视频）'
            value={body || ''}
            onChange={(v) => this.setState({body: v.target.value})}
          />
          <button onClick={() => {
            this.setState({body: ''})
          }}>
            清空
          </button>
          <button onClick={async () => {
            // let text = await navigator.clipboard.readText()
            // if (text) this.setState({body: text})
          }}>
            粘贴
          </button>
        </div>
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)