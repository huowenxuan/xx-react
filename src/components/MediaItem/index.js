import React, {PureComponent} from "react";
import './index.css'

export default class MediaItem extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props.data)
  }

  _renderText(item) {
    return <p>{item.body}</p>
  }

  _renderImage(item) {
    return <img className='image' src={item.body}/>
  }

  render() {
    const {data } = this.props
    const {type} = data
    let _renderItem = null
    switch(type) {
      case 'text':
        _renderItem = this._renderText(data)
        break
      case 'image':
        _renderItem = this._renderImage(data)
    }
    return (
      <div>
        {_renderItem}
      </div>
    )
  }
}

