import React, {PureComponent, useEffect, useState} from 'react'
import EditMediaItem from "../../components/Edit/MediaItem/"
import EditAdd from "../../components/Edit/Add"
import EditTextOverlay from '../../components/Edit/TextOverlay/'
import EditImageOverlay from '../../components/Edit/ImageOverlay/'
import EditLinkOverlay from '../../components/Edit/LinkOverlay/'
import EditWebVideoOverlay from '../../components/Edit/WebVideoOverlay/'
import NavBar from '../../components/NavBar/'
import './index.less'
import EditBottomButtons, {EditBottomHeight} from "../../components/Edit/Bottom/Buttons/"
import overlays from "../../components/overlays"
import EditBottomOverlay from "../../components/Edit/Bottom/BottomOverlay"
import images from '../../assets/images'
import * as request from '../../request'
import * as utils from '../../utils'
import * as _ from 'lodash'
// import {pageWrapper} from '../../components/HigherOrderStatelessComponents'
import {pageWrapper} from '../../components/HigherOrderComponents'
import OverlayViewFade from "../../components/overlays/OverlayViewFade"
import qs from 'querystring'
import qiniu from "../../utils/qiniu"

const MediaTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

@pageWrapper()
export default class Page extends PureComponent {
  props: any
  state: any

  postId = ''
  draftId = ''
  addBtn: any = React.createRef() // 当前点击的加号按钮
  uploading = null // 正在上传的对象
  isUploading = false // 是否正在上传

  constructor(props) {
    super(props)
    this.state = {
      openedAddItem: -1,
      post: {
        media: [],
        coverHidden: false,
        // status: 'public'
        status: 'private'
      },
      upload: {
        body: '',
        percent: 0,
      },
      completeBtnEnabled: true,
      error: null
    }
  }

  componentDidMount() {
    if (this.props.user && this.props.user.userId) {
      console.log('init data didmount')
      this.init()
    }
    window.addEventListener("popstate", this.onPopstate, false)
  }

  componentWillReceiveProps(nextProps, nextContext: any): void {
    const {user} = nextProps
    if (!this.props.user && user) {
      console.log('init data receiveProp')
      this.init()
    }
  }

  componentWillUnmount() {
    this.props.actions.clearEdit()
    this.removePopstateListener()
  }

  removePopstateListener = () => {
    console.log('remove popstate listener')
    window.removeEventListener('popstate', this.onPopstate)
  }

  onPopstate = (e) => {
    // singlespa在push时也会触发
    if (e.singleSpaTrigger === 'pushState') return
    console.log('浏览器返回事件', e)
    this.onBack()
  }

  getEditState = () => this.props.state.edit

  init = async () => {
    // const {id} = props.match.params
    let {photos, search} = this.props.location
    search = qs.decode(search.substr(1))
    const {userId, token} = this.props.user || {}
    if (search.postId) {
      this.postId = search.postId
      // 编辑旧帖子
      await this.props.actions.initPostEditWithPostId(this.postId, token)
    } else if (photos) {
      // 根据照片创建新帖子
      this.onPhotoChoose(0, photos, true)
      console.log('照片', photos)
      await this.props.actions.initPostEdit()
    } else if (search.draftId) {
      // 草稿
      this.draftId = search.draftId
      let {payload: draft} = await this.props.actions.initPostEditWithDraftId(userId, this.draftId)
      this.postId = draft._id
    } else {
      // 新建
      await this.props.actions.initPostEdit()
      this.openAdd(0)
    }
  }

  onBack = (isClick?) => {
    const {props} = this
    const {post, error, initData} = this.getEditState()
    const {userId} = this.props.user
    const back = () => {
      this.removePopstateListener()
      // 人为点击返回则需要返回，浏览器返回不需要
      isClick && props.history.goBack()
    }

    if (error) {
      back()
      return
    }

    let newPost = _.cloneDeep(post)
    // 过滤掉没有key的图片和视频
    newPost.media = newPost.media.filter(item => {
      if ((item.type === 'image' || item.type === 'shortvideo') &&
        !item.key
      ) return false
      return true
    })

    const deleteAndBack = () => {
      back()
      props.actions.deleteDraft(userId, this.draftId)
    }
    const saveAndBack = () => {
      back()
      props.actions.saveDraft(userId, this.draftId, newPost)
    }

    if (JSON.stringify(newPost) === JSON.stringify(initData)) {
      console.log('数据未修改，无需保存')
      back()
      return
    }

    if (!newPost.title && (!newPost.media || newPost.media.length === 0)) {
      if (this.draftId) {
        console.log('数据为空，且为草稿，删除草稿')
        overlays.showAlert('是否删除草稿？', '', [
          {text: '放弃更改', onPress: back},
          {text: '删除草稿', onPress: deleteAndBack},
        ], {showClose: true})
      } else {
        console.log('数据为空，不为草稿，直接返回，不操作')
        back()
      }
      return
    }

    console.log('保存草稿')
    overlays.showAlert('是否保存草稿？', '', [
      {text: '放弃更改', onPress: back},
      {text: '保存草稿', onPress: saveAndBack},
    ], {showClose: true})
  }

  // 弹出选择图片和权限遮罩
  showBottomEdit = (type) => {
    const {audio_id, status, protect} = this.state.post
    overlays.show(
      <EditBottomOverlay
        token={this.props.user.token}
        type={type}
        audio={audio_id}
        status={status}
        protect={protect}
        onUpdate={this.props.actions.setPostState}
      />
    )
  }

  complete = async () => {
    const {post} = this.getEditState()
    if (!post.title) {
      overlays.showToast('请输入标题')
      return
    }
    if (post.media.length === 0) {
      overlays.showToast('请添加图片或者文字')
      return
    }
    let newPost = _.cloneDeep(post)
    let newMedias = newPost.media
    for (let item of newMedias) {
      if (item.type === 'image' || item.type === 'shortvideo') {
        if (!item.key) {
          overlays.showToast('正在上传，请稍后再试')
          return
        }
      }

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
    let result
    this.setState({completeBtnEnabled: false})
    try {
      let {userId, token} = this.props.user
      if (this.postId) {
        result = await request.post(request.API.postUpdate + this.postId, {data}, token)
        overlays.showToast('更新成功')
      } else {
        result = await request.post(request.API.postCreate, {data}, token)
        overlays.showToast('创建成功')
      }
      this.draftId && this.props.actions.deleteDraft(userId, this.draftId)
      console.log(result)
      console.log(result._id)
      setTimeout(() => {
        this.props.history.replaceToShow(result._id)
      }, 1000)
      // this.props.history.replace(`/postedit?postId=${result._id}`)
      // window.location.href = `/postedit?postId=${result._id}`
    } catch (e) {
      overlays.showToast(e.message)
      this.setState({completeBtnEnabled: true})
    }
  }

  updateMediaByIndex = async (index, updateParams) => {
    await this.props.actions.updateMediaByIndex(index, updateParams)
    let {post} = this.getEditState()
    const {media} = post
    if (updateParams.isCover) {
      this.setCover(media[index].body, media[index].key)
    }
  }

  clickMedia = (data, index) => {
    this.showAddOverlay(data.type, index, false)
  }

  openAdd = (index) => {
    this.setState({
      openedAddItem: index
    }, () => {
      let rect = this.addBtn.current.getBoundingClientRect()
      let key = overlays.show(
        <EditAdd
          onDismiss={() => overlays.dismiss(key)}
          rect={rect}
          onText={() => this.onAddClick(MediaTypes.Text, index)}
          onImage={() => this.onAddClick(MediaTypes.Image, index)}
          onLink={() => this.onAddClick(MediaTypes.Link, index)}
          onVideo={() => this.onAddClick(MediaTypes.Video, index)}
        />
      )
    })
  }

  uploadMedia = async (media) => {
    const {body, file, type} = media
    this.props.actions.updateMediaByBody(body, {error: null})
    await new Promise(async (resolve, reject) => {
      try {
        this.setState({upload: {body, percent: 0}})
        this.uploading = await utils.uploadPhoto(
          body,
          file,
          (percent) => {
            console.log(percent)
            this.setState(({upload}: any) => ({
              upload: {...upload, percent}
            }))
          }
        )
        let key = await this.uploading.start()
        this.setState(({upload}: any) => ({
          upload: {...upload, percent: 100}
        }))
        const {post} = this.getEditState()
        let newBody = type === 'image'
          ? qiniu.getImageUrl(key)
          : qiniu.getOriginUrl(key)
        await this.props.actions.updateMediaByBody(body, {body: newBody, key})
        if (post.headbacimgurl === body) {
          await this.props.actions.setPostState({
            'coverKey': key,
            'headbacimgurl': newBody
          })
        }
      } catch (e) {
        console.error('upload error', media, e)
        await this.props.actions.updateMediaByBody(body, {error: e.message},)
      } finally {
        resolve()
      }
    })
  }

  /* 递归上传，每次都从上往下找未上传和未出错的 */
  uploadNextMedia = async () => {
    console.log('开始查找需要上传的内容')
    this.isUploading = true
    const {post} = this.getEditState()
    let nextUpload = post.media.find(item =>
      (item.type === 'image' || item.type === 'shortvideo') &&
      !item.key &&
      !item.error
    )
    if (!nextUpload) {
      console.log('全部上传完成')
      return
    }

    await this.uploadMedia(nextUpload)
    await this.uploadNextMedia()
    this.isUploading = false
  }

  mediaIsCover = (item) => {
    const {post} = this.getEditState()
    const {headbacimgurl, coverKey} = post
    if (!item) return false
    if (headbacimgurl === item.body) return true
    if (coverKey && coverKey === item.key) return true
    return false
  }

  /* 处理选择后的图片 */
  onPhotoChoose = async (index, photos, isImage) => {
    const {post} = this.getEditState()
    if (!photos || photos.length === 0) return
    // 如果没封面，就把第一张设为封面
    if (isImage && !post.headbacimgurl && !post.coverKey) {
      await this.setCover(photos[0].src)
    }

    let insertData = []
    for (let item of photos) {
      const {width, height, size, src, duration, file} = item
      insertData.push({
        type: isImage ? 'image' : 'shortvideo',
        body: src,
        info: isImage
          ? {width, height, size}
          : {width, height, size, duration},
        file
      })
    }
    await this.props.actions.insertMedias(index, insertData)
    this.isUploading || this.uploadNextMedia()
  }

  cancelUpload = (index, data) => {
    if (this.uploading && this.uploading.path === data.body) {
      this.uploading.cancel()
    }
    this.props.actions.deleteMedia(index)
  }

  choosePhoto = async (index, isImage) => {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, true)
      this.onPhotoChoose(index, data, isImage)
    } catch (e) {
      overlays.showToast(e.message)
    }
  }

  onCoverClick = async () => {
    let photos = await utils.choosePhoto(true, false)
    let photo = photos[0]
    const {file, src} = photo
    this.setCover(src)
    let uploading = await utils.uploadPhoto(src, file, null)
    let key = await uploading.start()
    this.setCover(qiniu.getOriginUrl(key), key)
  }

  setCover = async (body, key = '') => {
    await this.props.actions.setPostState({
      headbacimgurl: body,
      coverKey: key
    })
  }

  onAddClick = (type, index) => {
    if (type === MediaTypes.Image) {
      this.choosePhoto(index, true)
    } else if (type === MediaTypes.Video) {
      overlays.showActionSheet([
        {text: '本地', onPress: () => this.choosePhoto(index, false)},
        {text: '网络', onPress: () => this.showAddOverlay(type, index, true)},
      ])
    } else {
      this.showAddOverlay(type, index, true)
    }
  }

  renderAddItem = (index) => {
    return (
      <div
        ref={this.state.openedAddItem === index ? this.addBtn : null}
        className='add-row'
        onClick={() => this.openAdd(index)}
      >
        <img className='icon' src={images.add_spe_icon}/>
      </div>
    )
  }

  renderMedia = (media) => {
    if (!media || media.length === 0) return this.renderAddItem(0)
    const {upload} = this.state
    return media.map((data, index) => (
      // 每个item的key不变可保证每次修改元素后所有的视频不重新加载
      <ul key={`${data._id}-${data.body}`}>
        {this.renderAddItem(index)}
        <EditMediaItem
          upload={{
            progress: upload.body === data.body ? upload.percent : 0,
            error: data.error
          }}
          isCover={this.mediaIsCover(data)}
          data={data}
          onClick={() => this.clickMedia(data, index)}
          onDelete={() => this.props.actions.deleteMedia(index)}
          onUp={() => this.props.actions.mediaUp(index)}
          onDown={() => this.props.actions.mediaDown(index)}
          onSetCover={() => this.setCover(data.body, data.key)}
          onRetry={() => this.uploadMedia(data)}
          onCancel={() => this.cancelUpload(index, data)}
        />
        {index === media.length - 1
          ? this.renderAddItem(index + 1)
          : null}
      </ul>
    ))
  }

  showAddOverlay = (type, index, isNew) => {
    const {post} = this.getEditState()
    let curData = isNew ? null : post.media[index]
    let OverlayView
    if (type === 'text') {
      OverlayView = EditTextOverlay
    } else if (type === 'image') {
      OverlayView = EditImageOverlay
    } else if (type === 'link') {
      OverlayView = EditLinkOverlay
    } else if (type === 'video') {
      OverlayView = EditWebVideoOverlay
    } else {
      return
    }

    let key = overlays.show(
      <OverlayViewFade>
        <OverlayView
          data={curData}
          isCover={this.mediaIsCover(curData)}
          onChange={(data) => {
            overlays.dismiss(key)
            if (isNew) this.props.actions.insertMedias(index, [data])
            else this.updateMediaByIndex(index, data)
          }}
          onCancel={() => overlays.dismiss(key)}
        />
      </OverlayViewFade>
    )
  }

  renderCover = (post) => {
    const {coverKey, headbacimgurl, coverHidden} = post
    if (!headbacimgurl) {
      return (
        <div
          onClick={this.onCoverClick}
          className='edit-cover edit-cover-none'
        >
          上传封面
        </div>
      )
    } else if (!coverHidden) {
      return (
        <div className='edit-cover'>
          <img className='cover' src={headbacimgurl}/>
          <div className='wrapper'>
            <button
              onClick={() => this.props.actions.setPostState({coverHidden: true})}
              className='remove'
            >
              <img className='img' src={images.edit_remove_icon}/>
            </button>
            <button onClick={this.onCoverClick} className='update'>
              更改封面
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div
          onClick={() => this.props.actions.setPostState({coverHidden: false})}
          className='edit-cover-hidden'
        >
          <img className='img' src={headbacimgurl}/>
          显示封面
        </div>
      )
    }
  }

  render() {
    const {post, error, initData} = this.getEditState()
    if (error) {
      return (
        <div className='post-edit'>
          <NavBar title='写文章' onBack={() => this.onBack(true)}/>
          <div className='error'>{error}</div>
        </div>
      )
    }

    if (!initData || !this.props.user) {
      return (
        <div className='post-edit'>
          <NavBar title='写文章' onBack={() => this.onBack(true)}/>
          <div className='loading'>加载中...</div>
        </div>
      )
    }

    const {title, media, audio_id, status} = post
    return (
      <div className='post-edit'>
        <NavBar
          title='写文章'
          onBack={() => this.onBack(true)}
          rightButtons={[
            this.state.completeBtnEnabled
              ? {text: '完成', onClick: this.complete}
              : {text: ''},
          ]}
        />

        <div>
          {this.renderCover(post)}
          <div id='wrapper'>
            <input
              className='title-input'
              placeholder="输入标题(2-50字)"
              value={title || ''}
              onChange={e => this.props.actions.setPostState({title: e.target.value})}
            />
            {/*<p>{post.description}</p>*/}
            {this.renderMedia(media)}
          </div>

          <EditBottomButtons
            audio={audio_id}
            status={status}
            onLeftClick={() => this.showBottomEdit('audio')}
            onRightClick={() => this.showBottomEdit('status')}
          />
          <div style={{height: EditBottomHeight}}/>
        </div>
      </div>
    )
  }
}
