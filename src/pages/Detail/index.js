import React, {Component} from 'react'
import MediaItem from "../../components/MediaItem/";
import AddItem from "../../components/AddItem/";
import OpacityOverlay from '../../components/OpacityOverlay/'
import EditTextOverlay from '../../components/EditTextOverlay/'
import EditImageOverlay from '../../components/EditImageOverlay/'
import './index.css'

const post = require('../../tmp/post.json')
const MediaTypes = {
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
      openedAddItem: -1,
      post: null,
      overlayType: MediaTypes.None,
      // 当前更新的media
      currentEdit: {
        index: 0, // 包含media的item和添加按钮
        isNew: false  // 区分是修改item还是新增
      }
    }
    this.imageUpload = React.createRef()
    this.overlay = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params

    this._initData()
  }

  _toJson(data) {
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  }

  _initData() {
    const {media} = post
    for (let item of media) {
      const {info, type, style} = item
      if (type === 'image') {
        item.info = this._toJson(info) || {}
        item.style = this._toJson(style) || {}
      }
    }
    this.setState({post})
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
    this.overlay.current && this.overlay.current.hidden(() => {
      this.setState({overlayType: MediaTypes.None})
    })
  }

  _closeAddItem = () => this.setState({openedAddItem: -1})

  _updateMedia(isNew, newData) {
    const {index} = this.state.currentEdit
    this._hiddenOverlay()
    if (!newData.body) return

    const {media} = this.state.post
    if (isNew) {
      // insert
      let arr1 = media.slice(0, index)
      let arr2 = media.slice(index, media.length + 1)
      arr1.push(newData)
      let newMedia = arr1.concat(arr2)
      this._setPostState('media', newMedia)
    } else {
      // update
      media[index] = newData
      this._setPostState('media', media)
    }
  }

  _clickMedia(data, index) {
    this._closeAddItem()
    this.setState({
      overlayType: data.type,
      currentEdit: {index, isNew: false}
    })
  }


  _del(index) {
    let media = this.state.post.media
    media.splice(index, 1)
    this._setPostState('media', media)
  }

  _up(index) {
    let media = this.state.post.media
    if (index === 0) return
    [media[index - 1], media[index]] = [media[index], media[index - 1]]
    this._setPostState('media', media)
  }

  _down(index) {
    let media = this.state.post.media
    if (index === media.length - 1) return
    [media[index], media[index + 1]] = [media[index + 1], media[index]]
    this._setPostState('media', media)
  }

  _onAddClick(e, type, index) {
    e.stopPropagation()
    setTimeout(this._closeAddItem, 300)

    this.setState({
      currentEdit: {index, isNew: true}
    })
    if (type === MediaTypes.Image) {
      this.imageUpload.current.click()
    } else {
      this.setState({overlayType: type})
    }
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return <AddItem
      isOpen={openedAddItem === index}
      onClick={() => {
        this.setState({openedAddItem: index})
      }}
      onText={(e) => this._onAddClick(e, MediaTypes.Text, index)}
      onImage={(e) => this._onAddClick(e, MediaTypes.Image, index)}
      onLink={(e) => this._onAddClick(e, MediaTypes.Link, index)}
      onVideo={(e) => this._onAddClick(e, MediaTypes.Video, index)}
    />
  }

  _renderMedia(media) {
    return media.map((data, index) => (
      <ul key={data.id}>
        {this._renderAddItem(index)}
        <MediaItem
          data={data}
          onClick={() => this._clickMedia(data, index)}
          onDelete={() => this._del(index)}
          onUp={() => this._up(index)}
          onDown={() => this._down(index)}
        />
        {index === media.length - 1
          ? this._renderAddItem(index + 1)
          : null}
      </ul>
    ))
  }


  _renderOverlay() {
    const {overlayType} = this.state
    const {post, currentEdit} = this.state
    const {isNew, index} = currentEdit
    let curData = isNew ? null : post.media[index]
    switch (overlayType) {
      case 'text':
        return (
          <EditTextOverlay
            ref={this.overlay}
            data={curData}
            onChange={(data) => this._updateMedia(isNew, data)}
          />
        )
      case 'image':
        return (
          <EditImageOverlay
            ref={this.overlay}
            data={curData}
            onChange={(data) => this._updateMedia(isNew, data)}
            onCancel={this._hiddenOverlay}
          />
        )
    }
  }

  render() {
    const {post} = this.state
    if (!post) {
      return '等待'
    }

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
            this._updateMedia(true, {
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