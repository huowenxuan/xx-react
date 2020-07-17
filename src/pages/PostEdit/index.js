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
import * as request from '../../request'
import * as utils from '../../utils'
import * as _ from 'lodash'

const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
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
        coverHidden: false,
        status: 'public'
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
    this._coverFile = null // 原生图片选择器选择图片后的file文件，设置为封面图
    this.overlay = React.createRef()
    this.addBtn = React.createRef()
    this.postId = ''
  }

  componentDidMount() {
    this._initData()
  }

  async _initData() {
    const {id} = this.props.match.params
    const {photos} = this.props.location
    if (id) {
      this.postId = id
      // 编辑旧帖子
      let data = await request.get(request.API.postEdit + id, {}, Token)
      let post = data.post
      const {media} = post
      for (let item of media) {
        const {info, type, style} = item
        if (type === 'image') {
          item.info = utils.toJson(info)
          item.style = utils.toJson(style)
        }
      }
      console.log(post)
      this.setState({post})
    } else if (photos) {
      // 根据照片创建新帖子
      this._onPhotoChoose(photos, true)
    } else {
      this._openAdd(0)
    }
  }

  // 弹出选择图片和权限遮罩
  _showBottomEdit(type) {
    const {audio_id, status, protect} = this.state.post
    overlays.show(
      <EditBottomOverlay
        type={type}
        audio={audio_id}
        status={status}
        protect={protect}
        onUpdate={this._setPostState}
      />
    )
  }

  _setPostState = (field, data, cb) => {
    this.setState((preState) => ({
      post: {
        ...preState.post,
        [field]: data
      }
    }), cb)
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

    // 判断封面是否需要上传
    const {headbacimgurl, coverKey} = this.state.post
    if (!coverKey && headbacimgurl && !uploadMedias.find(i => i.item.body === headbacimgurl)) {
      uploadMedias.unshift({
        index: -1,
        isCover: true,
        item: {
          file: this._coverFile,
          body: headbacimgurl
        }
      })
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
      let {index, item, isCover} = uploadMedias[i]
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

      if (isCover) {
        console.log('封面上传完成 ', key)
        this._setPostState('coverKey', key)
      } else {
        console.log('上传完成 ', key)
        this._updateMedia(index, {key})
      }
    }
    this._resetProgress()
  }

  _complete = async () => {
    const {post} = this.state
    const {media} = post

    this.setState({completeBtnEnabled: false})
    try {
      await this._uploadFiles(media)
    } catch (e) {
      this._resetProgress()
      this.setState({completeBtnEnabled: true})
      if (e.message === 'cancel') {
        overlays.showToast('取消上传')
      } else {
        console.error(e)
        overlays.showAlert('上传失败，是否重新上传？', '', [
          {text: '确定', onPress: async () => this._complete()},
          {type: 'cancel'},
        ])
      }
    }

    let newPost = _.cloneDeep(this.state.post)
    let newMedias = newPost.media
    for (let item of newMedias) {
      delete item.file
      delete item.isCover
      item.info = JSON.stringify(item.info || {})
      // 不需要转字符串
      // item.style = JSON.stringify(item.style || {})
    }

    const {coverKey, title, coverHidden, audio_id, status, protect} = newPost
    let data = {
      media: newPost.media,
      title,
      coverKey,
      coverHidden,
      audio_id,
      status,
      protect,
    }
    console.log(data)
    let result
    try {
      if (this.postId) {
        result = await request.post(request.API.postUpdate + this.postId, {data}, Token)
        overlays.showToast('更新成功')
      } else {
        result = await request.post(request.API.postCreate, {data}, Token)
        overlays.showToast('创建成功')
      }
      console.log(result)
    } catch (e) {
      overlays.showToast(e.message)
      this.setState({completeBtnEnabled: true})
    }

    this.setState({completeBtnEnabled: true})
  }

  _hiddenOverlay = () => {
    this.overlay.current && this.overlay.current.hidden(() => {
      this.setState({overlayType: MediaTypes.None})
    })
  }

  _insertMedias(index, medias) {
    const {media} = this.state.post
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(...medias)
    let newMedia = arr1.concat(arr2)
    this._setPostState('media', newMedia)
  }

  _updateMedia(index, updateParams) {
    const {media} = this.state.post
    media[index] = {
      ...media[index],
      ...updateParams
    }
    this._setPostState('media', media)
    if (updateParams.isCover) {
      this._setItemToCover(index, media[index])
    }
  }

  // 把某项media设置为封面图
  _setItemToCover(index, item) {
    this._setPostState('headbacimgurl', item.body)
    this._setPostState('coverKey', item.key)
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
    this._setPostState('media', media, () => {
      if (this.state.post.media.length === 0) {
        this._openAdd(0)
      }
    })
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

  _openAdd = (index) => {
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

  _mediaIsCover(item) {
    const {headbacimgurl, coverKey} = this.state.post
    if (!item) return false
    if (headbacimgurl === item.body) return true
    if (coverKey && coverKey === item.key) return true
    return false
  }

  _onPhotoChoose(photos, isImage) {
    if (!photos || photos.length === 0) return
    // 如果没封面，就把第一张设为封面
    if (isImage && !this.state.post.headbacimgurl) {
      this._setLocalImageToCover(photos[0].src, photos[0].file)
    }

    let insertData = []
    const {index} = this.state.currentEdit
    for (let item of photos) {
      const {width, height, size, src, duration, file} = item
      insertData.push({
        type: isImage ? 'image' : 'sortvideo',
        body: src,
        info: isImage
          ? {width, height, size}
          : {width, height, size, duration},
        file
      })
    }
    this._insertMedias(index, insertData)
  }

  async _choosePhoto(isImage) {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, true)
      return this._onPhotoChoose(data, isImage)
    } catch (e) {
      overlays.showToast(e.message)
      return
    }
  }


  _onCoverClick = async () => {
    let photos = await utils.choosePhoto(true, false)
    let photo = photos[0]
    const {file, src} = photo
    this._setLocalImageToCover(src, file)
  }

  _setLocalImageToCover(src, file) {
    this._setPostState('headbacimgurl', src)
    this._setPostState('coverKey', '')
    this._coverFile = file
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

  _onOverlayChange = (data, isNew) => {
    const {index} = this.state.currentEdit
    this._hiddenOverlay()
    if (isNew)
      this._insertMedias(index, [data])
    else
      this._updateMedia(index, data)
  }

  _renderAddItem(index) {
    const {openedAddItem} = this.state
    return (
      <div
        ref={openedAddItem === index ? this.addBtn : null}
        className='add-row'
        onClick={() => this._openAdd(index)}
      >
        <img className='add-icon' src={images.add_spe_icon}/>
      </div>
    )
  }

  _renderMedia(media) {
    const {coverKey, headbacimgurl} = this.state.post
    if (!media || media.length === 0) {
      return this._renderAddItem(0)
    }
    return media.map((data, index) => (
      // 每个item的key不变可保证每次修改元素后所有的视频不重新加载
      <ul key={`${data._id}-${data.body}`}>
        {this._renderAddItem(index)}
        <MediaItem
          isCover={this._mediaIsCover(data)}
          data={data}
          onClick={() => this._clickMedia(data, index)}
          onDelete={() => this._del(index)}
          onUp={() => this._up(index)}
          onDown={() => this._down(index)}
          onSetCover={() => this._setItemToCover(index, data)}
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
          isCover={this._mediaIsCover(curData)}
          onChange={(data) => this._onOverlayChange(data, isNew)}
          onCancel={this._hiddenOverlay}
        />
      </div>
    )
  }

  _renderCover() {
    const {post} = this.state
    const {coverKey, headbacimgurl, coverHidden} = post
    if (!headbacimgurl) {
      return (
        <div
          onClick={this._onCoverClick}
          className='edit-cover edit-cover-none'
        >
          上传封面
        </div>
      )
    } else if (!coverHidden) {
      return (
        <div className='edit-cover'>
          <img
            className='cover'
            src={headbacimgurl}
          />
          <div className='edit-cover-wrapper'>
            <button
              onClick={() => this._setPostState('coverHidden', true)}
              className='edit-cover-remove'>
              <img className='edit-cover-remove-img' src={images.edit_remove_icon}/>
            </button>
            <button
              onClick={this._onCoverClick}
              className='edit-cover-update'>
              更改封面
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div
          onClick={() => this._setPostState('coverHidden', false)}
          className='edit-cover-hidden'
        >
          <img className='edit-cover-hidden-img' src={headbacimgurl}/>
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
          <p>正在上传第{currentIndex + 1}张{parseInt(currentPercent)}%，共{count}张</p>
          <button
            className='percent-cancel'
            onClick={this._cancelUpload}
          >
            取消上传
          </button>
        </div>
      </div>
    )
  }

  render() {
    const {post, completeBtnEnabled} = this.state
    const {title, media, audio_id, status} = post
    return (
      <div>
        <NavBar
          title='写文章'
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
              value={title || ''}
              onChange={e => this._setPostState('title', e.target.value)}
            />
          </div>
          {/*<p>{post.description}</p>*/}
          {this._renderMedia(media)}
        </div>

        {this._renderAddOverlay()}

        <EditBottomButtons
          audio={audio_id}
          status={status}
          onLeftClick={() => this._showBottomEdit('audio')}
          onRightClick={() => this._showBottomEdit('status')}
        />
        <div style={{height: EditBottomHeight}}/>
        {this._renderPercent()}
      </div>
    )
  }
}