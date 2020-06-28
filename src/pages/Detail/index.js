import React, {Component} from 'react'
import MediaItem from "../../components/MediaItem/";
import AddItem from "../../components/AddItem/";
import './index.css'

const post = require('../../tmp/post.json')

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedAddItem: -1,
      post
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return <AddItem
      isOpen={openedAddItem === index}
      onClick={()=>{
        this.setState({openedAddItem: index})
      }}
    />

  }

  _renderMedia(media) {
    return media.map((data, index) => (
      <div key={data.id}>
        {this._renderAddItem(index)}
        <MediaItem data={data}/>
        {index === media.length - 1
          ? this._renderAddItem(index + 1)
          : null}
      </div>
    ))
  }

  render() {
    const {post} = this.state
    return (
      <div>
        <a href='#/'>回到Home</a>
        <button onClick={() => this.props.history.goBack()}>back</button>

        <div id='wrapper'>
          <div id='title-box'>
            <input
              id='title-input'
              className='btn btn-primary btn-block'
              // onFocus='StartEditTitle(this)'
              // onBlur='ResetTitleStyle(this)'
              placeholder="输入标题"
              defaultValue={post.title}
            />
          </div>

          <p>{post.description}</p>
          {this._renderMedia(post.media)}
        </div>
      </div>
    )
  }
}