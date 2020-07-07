import React, {PureComponent} from "react";
import './index.css'
import opacityWrapper from '../Wrappers/opacityWrapper'

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
      <div className='wrapper'>
        <input
          className='input'
          placeholder='url'
          value={body || ''}
          onChange={(v) => this.setState({body: v.target.value})}
        />
        <button onClick={onCancel}>
          取消
        </button>
        <button>
          确认
        </button>
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)