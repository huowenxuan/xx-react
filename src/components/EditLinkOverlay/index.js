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

  render() {
    const {
      body,
    } = this.state
    const {onCancel} = this.props
    return (
      <div className='add-link-wrapper'>
        <input
          className='input-link-url'
          placeholder='url'
        />
      </div>
    )
  }
}

export default opacityWrapper(EditTextOverlay)