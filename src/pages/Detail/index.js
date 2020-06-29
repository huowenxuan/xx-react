import React, {Component} from 'react'
import MediaItem from "../../components/MediaItem/";
import AddItem from "../../components/AddItem/";
import OpacityOverlay from '../../components/OpacityOverlay/'
import AddTextOverlay from '../../components/AddTextOverlay/'
import './index.css'

const post = require('../../tmp/post.json')
const OverlayTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedAddItem: 0,
      overlayType: OverlayTypes.None,
      overlayIndex: -1,
      post
    }

    this.imageUpload = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params
  }

  _insertToMedia(index, data) {
    const {media} = this.state.post
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(data)
    let newMedia = arr1.concat(arr2)
    this.setState((preState)=>({
      post: {
        ...preState.post,
        media: newMedia
      }
    }))
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return <AddItem
      isOpen={openedAddItem === index}
      onClick={() => {
        this.setState({openedAddItem: index})
      }}
      onText={() => {
        this.setState({
          overlayType: OverlayTypes.Text,
          overlayIndex: index
        })
      }}
      onImage={() => {
        this.setState({
          overlayIndex: index
        })
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
    const {overlayIndex} = this.state
    return <AddTextOverlay
      onChange={(data)=>{
        this._insertToMedia(overlayIndex, data)
      }}
    />
  }

  _renderOverlay() {
    const {overlayType} = this.state
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
      <OpacityOverlay
        show={!!overlayType}
        onHidden={()=>this.setState({overlayType: OverlayTypes.None})}
      >
        {overlayView}
      </OpacityOverlay>
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
            let src = window.URL.createObjectURL(files[0]);
            console.log(src)
            this._insertToMedia(this.state.overlayIndex, {
              type: 'image',
              body: src,
              is_new: true
            })
          }}
        />
      </div>
    )
  }
}