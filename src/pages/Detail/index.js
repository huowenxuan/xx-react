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
      },
      upload: {
        show: false,
        currentIndex: 0,
        currentPercent: 0,
        count: 0,
        percent: 0
      },
      completeBtnEnabled: true
    }
    this.overlay = React.createRef()
    this.addBtn = React.createRef()
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this._initData()
  }

  _initData() {
    const {media} = post
    for (let item of media) {
      const {info, type, style} = item
      if (type === 'image') {
        item.info = utils.toJson(info) || {}
        item.style = utils.toJson(style) || {}
      }
    }
    this.setState({post})
  }

  // 弹出选择图片和权限遮罩
  _showBottomEdit(status) {
    overlays.show(<EditBottomOverlay status={status}/>)
  }

  _setPostState(field, data) {
    this.setState((preState) => ({
      post: {
        ...preState.post,
        [field]: data
      }
    }))
  }


  _resetProgress = () => {
    this.setState({
      upload: {
        show: false,
        currentIndex: 0,
        currentPercent: 0,
        count: 0,
        percent: 0
      },
      completeBtnEnabled: true,
    })
  }

  _cancelUpload = () => {
    overlays.showAlert('是否取消上传', '', [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          this._uploadCancel = true
          this._resetProgress()
        }
      }
    ])
  }

  async _uploadFiles(media) {
    let uploading = null
    this._uploadCancel = false

    let uploadMedias = []
    for (let i = 0; i < media.length; i++) {
      let item = media[i]
      let {type, body} = item
      if (type === 'image' || type === 'shortvideo') {
        if (body.startsWith('blob') ||
          body.startsWith('wx') ||
          body.startsWith('weixin')
        ) {
          uploadMedias.push({index: i, item})
        }
      }
    }

    let uploadCount = uploadMedias.length
    if (uploadCount > 0) {
      this.setState({
        upload: {
          show: true,
          count: uploadCount,
          percent: 0,
          currentIndex: 0,
          currentPercent: 0
        }
      })
    }
    for (let i = 0; i < uploadMedias.length; i++) {
      let {index, item}  = uploadMedias[i]
      this.setState((prev)=>({
        upload: {
          ...prev.upload,
          currentIndex: index,
          currentPercent: 0
        }
      }))
      const {body, tmpParams} = item
      const {file} = tmpParams || {}
      await new Promise(async (resolve, reject) => {
        uploading = await utils.uploadPhoto(body, file, (percent) => {
          this.setState((prev)=>({
            upload: {
              ...prev.upload,
              currentIndex: i,
              currentPercent: percent,
              percent: ((i / uploadCount) * 100) + (percent / uploadCount)
            }
          }))
          console.log(percent)
          // this._uploadCancel = true
          if (this._uploadCancel) {
            uploading && uploading.cancel()
            reject(new Error('cancel'))
          }
        })
        uploading.start()
          .then(key=>resolve(key))
          .catch(reject)
      })
    }
  }

  _complete = async () => {
    const {post} = this.state
    const {media} = post

    try {
      await this._uploadFiles(media)
    } catch (e) {
      if (e.message === 'cancel') {
        overlays.showToast('取消上传')
      } else {
        overlays.showAlert('上传失败，是否重新上传？', e.message, [
          {text: '确定', onPress: async () => this._complete()},
          {type: 'cancel'},
        ])
      }
    }
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

  async _choosePhoto(isImage) {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, 1)
    } catch (e) {
      overlays.showToast(e.message)
      return
    }

    for (let item of data) {
      const {width, height, size, src, duration, file} = item
      if (isImage) {
        this._updateMedia(true, {
          type: 'image',
          body: src,
          info: {width, height, size, duration},
          tmpParams: {file}
        })
      } else {
        this._updateMedia(true, {
          type: 'sortvideo',
          body: src,
          info: {width, height, size},
          tmpParams: {file}
        })
      }
    }

  }

  _onAddClick(type, index) {
    this.setState({currentEdit: {index, isNew: true}})
    if (type === MediaTypes.Image) {
      this._choosePhoto(true)
    } else if (type === MediaTypes.Video) {
      overlay.showActionSheet([
        {text: '本地', onPress: () => this._choosePhoto(false)},
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

  _renderPercent() {
    const {
      currentIndex,
      currentPercent,
      count,
      percent,
      show
    } = this.state.upload
    if (!show) return null

    return (
      <div id='percent'>
        <div id='percent-child'>
          <p>当前第{currentIndex+1}张{parseInt(currentPercent)}%，共有{count}张{parseInt(percent)}%</p>
          <button
            onClick={this._cancelUpload}
            style={{marginTop: 15}}>
            取消
          </button>
        </div>
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
          rightButtons={[
            {text: '完成', onClick: this._complete}
          ]}
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
        {this._renderPercent()}
      </div>
    )
  }
}