import React, {PureComponent} from 'react'
import MediaItem from "../../components/MediaItem/"
import EditAdd from "../../components/EditAdd/"
import EditTextOverlay from '../../components/EditTextOverlay/'
import EditImageOverlay from '../../components/EditImageOverlay/'
import EditLinkOverlay from '../../components/EditLinkOverlay/'
import EditWebVideoOverlay from '../../components/EditWebVideoOverlay/'
import NavBar from '../../components/NavBar/'
import './index.css'
import overlay from "../../components/overlays"
import EditBottomButtons from "../../components/EditBottom/EditBottomButtons/"
import overlays from "../../components/overlays"
import EditBottomOverlay from "../../components/EditBottom/EditBottomOverlay"
import images from '../../assets/images'
import {get} from '../../request'
import * as utils from '../../utils'

const post = require('../../tmp/post.json')
const MediaTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

export default class DetailPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      openedAddItem: -1,
      post: null,
      overlayType: MediaTypes.None,
      // 当前更新的media
      currentEdit: {
        index: -1, // 包含media的item和添加按钮
        isNew: false  // 区分是修改item还是新增
      }
    }
    this.imageUpload = React.createRef()
    this.overlay = React.createRef()
    this.addBtn = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this._initData()

    this.initWxConfig()
  }

  async initWxConfig() {
    let url = encodeURIComponent('http://m.tripcity.cn/')
    let result = await get('/bookapi/weixin/jsconfig?url=' + url)
    window.wx.config({
      ...result.data,
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    })
  }


  // 弹出选择图片和权限遮罩
  _showBottomEdit(status) {
    overlays.show(<EditBottomOverlay status={status}/>)
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

  _onAddOpen = (index) => {
    this.setState({openedAddItem: index}, () => {
      let rect = this.addBtn.current.getBoundingClientRect()
      let key = overlays.show(
        <EditAdd
          onDismiss={() => overlays.dismiss(key)}
          rect={rect}
          onText={() => this._onAddClick(MediaTypes.Text, index)}
          onImage={() => this._onAddClick(MediaTypes.Image, index)}
          onLink={() => this._onAddClick(MediaTypes.Link, index)}
          onVideo={() => this._onAddClick(MediaTypes.Video, index)}
        />
      )
    })
  }

  async _pickPhoto(isImage) {
    try {
      let data = await utils.pickPhoto(isImage, 1)
      for (let item of data) {
        const {width, height, size, src, duration} = item
        if (isImage) {
          this._updateMedia(true, {
            type: 'image',
            body: src,
            is_new: true,
            info: {width, height, size, duration}
          })
        } else {
          this._updateMedia(true, {
            type: 'sortvideo',
            body: src,
            is_new: true,
            info: {width, height, size}
          })
        }
      }
    } catch(e) {
      overlays.showToast(e.message)
    }
  }

  _onAddClick(type, index) {
    this.setState({currentEdit: {index, isNew: true}})
    if (type === MediaTypes.Image) {
      this._pickPhoto(true)
    } else if (type === MediaTypes.Video) {
      overlay.showActionSheet([
        {text: '本地', onPress: () => this._pickPhoto(false)},
        {text: '网络', onPress: () => this.setState({overlayType: type})},
      ])
    } else {
      this.setState({overlayType: type})
    }
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return (
      <div
        ref={openedAddItem === index ? this.addBtn : null}
        className='add-row'
        onClick={() => this._onAddOpen(index)}
      >
        <img className='add-icon' src={images.add_spe_icon}/>
      </div>
    )
  }

  _renderMedia(media) {
    return media.map((data, index) => (
      // 每个item的key不变可保证每次修改元素后所有的视频不重新加载
      <ul key={`${data._id}-${data.body}`}>
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

  _renderAddOverlay() {
    const {overlayType} = this.state
    const {post, currentEdit} = this.state
    const {isNew, index} = currentEdit
    let curData = isNew ? null : post.media[index]
    let OverlayView = null
    switch (overlayType) {
      case 'text':
        OverlayView = EditTextOverlay
        break
      case 'image':
        OverlayView = EditImageOverlay
        break
      case 'link':
        OverlayView = EditLinkOverlay
        break
      case 'video':
        OverlayView = EditWebVideoOverlay
        break
      default:
        return null
    }

    return (
      <div style={{
        // 防止被navbar遮挡
        position: 'relative', zIndex: 999
      }}>
        <OverlayView
          ref={this.overlay}
          data={curData}
          onChange={(data) => this._updateMedia(isNew, data)}
          onCancel={this._hiddenOverlay}
        />
      </div>
    )
  }

  _renderCover() {
    const {post} = this.state
    const {coverKeyUrl} = post
    return (
      <div
        id='cover'
        style={{backgroundImage: `url(${coverKeyUrl})`}}
      >
      </div>
    )
  }

  render() {
    const {post} = this.state
    if (!post) return '等待'

    return (
      <div>
        <NavBar
          title={post.title}
        />
        <a href='#/'>回到Home</a>
        <button onClick={() => this.props.history.goBack()}>back</button>

        {this._renderCover()}
        <div id='wrapper'>
          <div id='title-box'>
            <input
              id='title-input'
              placeholder="输入标题"
              defaultValue={post.title}
            />
          </div>
          <p>{post.description}</p>
          {this._renderMedia(post.media)}
        </div>

        {this._renderAddOverlay()}

        <EditBottomButtons
          onLeftClick={() => this._showBottomEdit('music')}
          onRightClick={() => this._showBottomEdit('permission')}
        />
      </div>
    )
  }
}