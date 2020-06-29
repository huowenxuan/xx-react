import React, {Component} from 'react'
import MediaItem from "../../components/MediaItem/";
import AddItem from "../../components/AddItem/";
import './index.css'

const post = require('../../tmp/post.json')
const OverlayTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedAddItem: 0,
      overlayType: OverlayTypes.None,
      overlayDisplay: 'none',
      post
    }

    this.imageUpload = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return <AddItem
      isOpen={openedAddItem === index}
      onClick={() => {
        this.setState({openedAddItem: index})
      }}
      onText={() => {
        this.setState({overlayDisplay: 'inherit'}, () => {
          setImmediate(() => {
            this.setState({
              overlayType: 'text',
            })
          })
        })
      }}
      onImage={() => {
        this.imageUpload.current.click()
      }}
      onLink={() => {
        console.log('imag3')
      }}
      onVideo={() => {
        console.log('image33')
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

  _renderOverlayText() {
    return (
      <div
        style={{
          height: '50px', width: '300px', backgroundColor: 'blue'
        }}
      />
    )
  }

  _renderOverlay() {
    const {overlayType, overlayDisplay} = this.state
    let overlayView = null
    switch (overlayType) {
      case 'text':
        overlayView = this._renderOverlayText()
        break
      default:
        overlayView = <div style={{
          height: '50px', width: '300px', backgroundColor: 'blue'
        }}/>
    }
    return (
      <div
        className='item-overlay'
        style={{
          display: overlayDisplay,
          opacity: overlayType ? 1 : 0
        }}
        onClick={() => {
          this.setState({overlayType: OverlayTypes.None})
          setTimeout(() => {
            this.setState({overlayDisplay: 'none'})
          }, 300)
        }}
      >
        {overlayView}
      </div>
    )
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


        {this._renderOverlay()}
        <input
          ref={this.imageUpload}
          id='imageUpload'
          type='file'
          multiple={true}
          // accept='.xlsx, .xls'
          // onChange事件触发的条件为其value发生变化，将value置空可重复选择同一个文件，否则第二次选择相同文件没有反应
          onClick={(event) => {
            event.target.value = null
          }}
          onChange={(e) => {
            let files = this.imageUpload.current.files
            let post = this.state.post
            let src = window.URL.createObjectURL(files[0]);
            console.log(src)
            post.media.unshift({
              type: 'image',
              body: src,
              is_new: true
            })
            this.setState(({post}))
          }}
        />
      </div>
    )
  }
}