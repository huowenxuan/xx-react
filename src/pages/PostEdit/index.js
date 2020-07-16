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
import EditBottomButtons, {EditBottomHeight} from "../../components/EditBottom/EditBottomButtons/"
import overlays from "../../components/overlays"
import EditBottomOverlay from "../../components/EditBottom/EditBottomOverlay"
import images from '../../assets/images'
import {get} from '../../request'
import * as utils from '../../utils'
import * as _ from 'lodash'

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
      post: {
        media: [],
        coverHidden: true
      },
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
    this._initData()
  }

  _initData() {
    const {id} = this.props.match.params
    const {photos} = this.props.location
    if (id) {
      // 编辑旧帖子
    } else if (photos) {
      // 根据照片创建新帖子
    }

    const {media} = post
    for (let item of media) {
      const {info, type, style} = item
      if (type === 'image') {
        item.info = utils.toJson(info) || {}
        item.style = utils.toJson(style) || {}
      }
    }
    // this.setState({post})
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
    })
  }

  _cancelUpload = () => {
    overlays.showAlert('是否取消上传', '', [
      {text: '取消'},
      {text: '确定', onPress: () => this._uploadCancel = true}
    ])
  }

  async _uploadFiles(media) {
    this._uploadCancel = false

    let uploadMedias = []
    for (let i = 0; i < media.length; i++) {
      let item = media[i]
      let {type, body, key} = item
      if (
        !key && (
          type === 'image' ||
          type === 'sortvideo'
        ) && (
          body.startsWith('blob') ||
          body.startsWith('wx') ||
          body.startsWith('weixin')
        )
      ) {
        uploadMedias.push({index: i, item})
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
      let beforeDate = new Date()
      let {index, item} = uploadMedias[i]
      this.setState((prev) => ({
        upload: {
          ...prev.upload,
          currentIndex: i,
          currentPercent: 0,
          percent: (i / uploadCount) * 100
        }
      }))
      const {body, file} = item
      let key = await new Promise(async (resolve, reject) => {
        let timer, uploading
        const error = (e) => reject(e)
        // 检查是否点击了取消
        timer = setInterval(() => {
          if (this._uploadCancel) {
            uploading && uploading.cancel()
            error(new Error('cancel'))
          }
        }, 300)
        const onProgress = (percent) => {
          console.log(percent)
          if (new Date() - 300 <= beforeDate)
            return
          beforeDate = new Date()
          this.setState((prev) => ({
            upload: {
              ...prev.upload,
              currentPercent: percent,
              percent: ((i / uploadCount) * 100) + (percent / uploadCount)
            }
          }))
        }
        try {
          uploading = await utils.uploadPhoto(body, file, onProgress)
          let key = await uploading.start()
          this.setState((prev) => ({
            upload: {
              ...prev.upload,
              currentPercent: 100,
              percent: ((i / uploadCount) * 100) + (100 / uploadCount)
            }
          }))
          resolve(key)
        } catch (e) {
          error(e)
        } finally {
          timer && clearInterval(timer)
        }
      })

      console.log('上传完成 ', key)
      this._updateMediaByIndex(index, {key})
    }
    this._resetProgress()
  }

  _complete = async () => {
    const {post} = this.state
    const {media} = post

    this.setState({completeBtnEnabled: false})
    try {
      await this._uploadFiles(media)
      let newPost = _.cloneDeep(this.state.post)
      let newMedias = newPost.media
      for (let item of newMedias) {
        if (item.key) {
          item.body = item.key
          delete item.key
          delete item.file
        }
      }
      console.log(newMedias)
    } catch (e) {
      this._resetProgress()
      if (e.message === 'cancel') {
        overlays.showToast('取消上传')
      } else {
        console.error(e)
        overlays.showAlert('上传失败，是否重新上传？', '', [
          {text: '确定', onPress: async () => this._complete()},
          {type: 'cancel'},
        ])
      }
    } finally {
      this.setState({completeBtnEnabled: true})
    }
  }

  _hiddenOverlay = () => {
    this.overlay.current && this.overlay.current.hidden(() => {
      this.setState({overlayType: MediaTypes.None})
    })
  }

  _updateMediaByIndex(index, updateParams) {
    const {media} = this.state.post
    media[index] = {
      ...media[index],
      ...updateParams
    }
    this._setPostState('media', media)
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
      data = await utils.choosePhoto(isImage, true)
    } catch (e) {
      overlays.showToast(e.message)
      return
    }

    for (let item of data) {
      const {width, height, size, src, duration, file} = item
      this._updateMedia(true, {
        type: isImage ? 'image' : 'sortvideo',
        body: src,
        info: isImage
          ? {width, height, size}
          : {width, height, size, duration},
        file
      })

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
    if (!media || media.length === 0) {
      return this._renderAddItem(0)
    }
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
    if (!post) return null
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

  _onCoverClick = async  ()=>{
    // let photos = await utils.choosePhoto(true, false)
    // let photo = photos[0]
    // const {file, src} = photo
    // this._setPostState('coverKeyUrl', src)
    // this._coverFile = file
    this._setPostState('coverKeyUrl', 'blob:http://localhost:3000/0c1adb63-987a-47e3-9c9e-d691d0ff225d')
  }

  _renderCover() {
    const {post, coverHidden} = this.state
    const {coverKeyUrl} = post
    if (!coverKeyUrl) {
      return (
        <div
          onClick={this._onCoverClick}
          className='edit-cover edit-cover-none'
          style={{backgroundImage: `url(${coverKeyUrl})`}}
        >
          上传封面
        </div>
      )
    } else if (!coverHidden) {
      return (
        <div
          className='edit-cover'
          style={{backgroundImage: `url(${coverKeyUrl})`}}
        >

        </div>
      )
    } else {
      return (
        <div
          onClick={()=>this.setState({coverHidden: false})}
          className='edit-cover-close'
          style={{backgroundImage: `url(${coverKeyUrl})`}}
        >
          <img className='edit-cover-close-img' src={images.icon_limit_red}/>
          显示封面
        </div>
      )
    }
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
          <p>当前第{currentIndex + 1}张{parseInt(currentPercent)}%，共有{count}张{parseInt(percent)}%</p>
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
    const {post, completeBtnEnabled} = this.state
    const {title, media} = post
    return (
      <div>
        <NavBar
          title={title}
          onBack={this.props.history.goBack}
          rightButtons={[
            completeBtnEnabled
              ? {text: '完成', onClick: this._complete}
              : {text: ''},
          ]}
        />

        {this._renderCover()}
        <div id='wrapper'>
          <div id='title-box'>
            <input
              id='title-input'
              placeholder="输入标题(2-50字)"
              defaultValue={title}
            />
          </div>
          {/*<p>{post.description}</p>*/}
          {this._renderMedia(media)}
        </div>

        {this._renderAddOverlay()}

        <EditBottomButtons
          onLeftClick={() => this._showBottomEdit('music')}
          onRightClick={() => this._showBottomEdit('permission')}
        />
        <div style={{height: EditBottomHeight}}/>
        {this._renderPercent()}
      </div>
    )
  }
}