import React, {PureComponent} from "react";
import './index.css'

export default class AddTextOverlay extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {onChange} = this.props
    onChange && onChange({
      type: 'text',
      body: '哈哈'
    })
  }

  render() {
    return (
      <div
        style={{
          height: '50px', width: '300px', backgroundColor: 'blue'
        }}
      />
    )
  }
}

