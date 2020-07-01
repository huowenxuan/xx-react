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
  Image: null,
  Link: 'link',
  Video: 'video'
}

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedAddItem: -1,
      post,
      overlay: {
        type: OverlayTypes.None,
        index: -1, // 包含media的item和添加按钮
        data: null // 区分是修改item还是新增
      }
    }

    this.imageUpload = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params
  }

  componentWillUnmount() {
    this.fullOverlay.current.removeEventListener('click')
  }

  _setPostState(field, data) {
    this.setState((preState) => ({
      post: {
        ...preState.post,
        [field]: data
      }
    }))
  }

  _hiddenOverlay = () => {
    this.setState({
      overlay: {
        type: OverlayTypes.None,
        index: -1,
        date: null,
      },
    })
  }

  _closeAddItem = () => {
    this.setState({
      openedAddItem: -1
    })
  }

  _updateMedia(newData) {
    this._hiddenOverlay()
    const {index, data} = this.state.overlay
    if (newData.type === 'text') {
      if (!newData.body) {
        return
      }
    }

    const {media} = this.state.post
    if (data) {
      // update
      media[index] = {
        ...data,
        ...newData
      }
      this._setPostState('media', media)
    } else {
      // insert
      let arr1 = media.slice(0, index)
      let arr2 = media.slice(index, media.length + 1)
      arr1.push(newData)
      let newMedia = arr1.concat(arr2)
      this._setPostState('media', newMedia)
    }
  }

  _enterTextEdit(index, data) {
    this.setState({
      overlay: {
        type: OverlayTypes.Text,
        index,
        data
      }
    })
  }

  _clickMedia(index, data) {
    this._closeAddItem()
    switch (data.type) {
      case 'text':
        this._enterTextEdit(index, data)
        break
      case 'image':
        console.log('点击图片')
        break
    }
  }

  _onAddClick(e, overlayType, index) {
    e.stopPropagation()
    setTimeout(this._closeAddItem, 300)
    this.setState({
      overlay: {
        type: overlayType,
        index,
        data: null
      }
    })

    if (overlayType === OverlayTypes.Image) {
      this.imageUpload.current.click()
    }
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return <AddItem
      isOpen={openedAddItem === index}
      onClick={() => {
        this.setState({openedAddItem: index})
      }}
      onText={(e) => this._onAddClick(e, OverlayTypes.Text, index)}
      onImage={(e) => this._onAddClick(e, OverlayTypes.Image, index)}
      onLink={(e) => this._onAddClick(e, OverlayTypes.Link, index)}
      onVideo={(e) => this._onAddClick(e, OverlayTypes.Video, index)}
    />
  }

  _renderMedia(media) {
    return media.map((data, index) => (
      <ul key={data.id}>
        {this._renderAddItem(index)}
        <MediaItem
          data={data}
          onClick={() => this._clickMedia(index, data)}
          onDelete={() => {
            let media = this.state.post.media
            media.splice(index, 1)
            this._setPostState('media', media)
          }}
          onUp={() => {
            let media = this.state.post.media
            if (index === 0) return
            [media[index - 1], media[index]] = [media[index], media[index - 1]]
            this._setPostState('media', media)
          }}
          onDown={() => {
            let media = this.state.post.media
            if (index === media.length - 1) return
            [media[index], media[index + 1]] = [media[index + 1], media[index]]
            this._setPostState('media', media)
          }}

        />
        {index === media.length - 1
          ? this._renderAddItem(index + 1)
          : null}
      </ul>
    ))
  }

  _renderOverlayText() {
    const {overlay} = this.state
    return <AddTextOverlay
      data={overlay.data}
      onChange={(data) => {
        this._updateMedia(data)
      }}
    />
  }

  _renderOverlay() {
    const {overlay} = this.state
    let overlayView = null
    switch (overlay.type) {
      case 'text':
        overlayView = this._renderOverlayText()
        break
    }
    return (
      <OpacityOverlay
        show={!!overlay.type}
        onHidden={this._hiddenOverlay}
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
            this._updateMedia({
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