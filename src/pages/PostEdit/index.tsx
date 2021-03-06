import React, {PureComponent, Component, useEffect, useState} from 'react'
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
import {cloneDeep} from 'lodash'
import {routes} from '../../Router'
// import cloneDeep from 'lodash/cloneDeep'
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
  search
  location
  from = '' // 来源 book
  user

  constructor(props) {
    super(props)
    this.state = {
      openedAddItem: -1,
      upload: {
        body: '',
        percent: 0,
      },
      completeBtnEnabled: false,
      title: '',
      showBottom: true
    }

    const {location} = props
    let {search} = location
    // 在singlespa中，didmount之后location会被重置，只保留pathname、search等参数，自定义的参数被删掉
    this.location = location
    search = qs.decode(search.substr(1))
    this.search = search
    this.from = search.from
  }

  async componentDidMount() {
    // singlespa错误：切换应用再回来会先处于上一次的状态再处理新的状态
    // 1. 进入当前子应用，页面A
    // 2. 退出当前子应用进入其他应用
    // 3. 再进入当前子应用，页面B，会先mount A，再马上unmount，再加载B（href一直都是B）
    if (window.location.pathname !== routes.edit) {
      return
    }
    if (this.search.from === 'book') {
      let {data} = await request.post('/bookapi/auth/login/phoneOnly', {phone: this.search.phone})
      this.user = {
        userId: data.user_id,
        token: data.token
      }
      this.init(this.user, true)
    } else if (this.props.user && this.props.user.userId) {
      this.init(this.props.user, true)
    } else {
      console.log('didmount无用户信息')
    }
    window.addEventListener("popstate", this.onPopstate, false)
  }

  componentWillReceiveProps(nextProps, nextContext: any): void {
    const {user} = nextProps
    if (!this.props.user.userId && user.userId) {
      this.init(user, false)
    }
  }

  componentWillUnmount() {
    console.log('PostEdit unmount')
    this.props.actions.clearEdit()
    // 不可以在这里取消监听popstate，会导致事件无法执行
  }

  removePopstateListener = () => {
    window.removeEventListener('popstate', this.onPopstate)
  }

  onPopstate = (e) => {
    // singlespa在push、replace时也会触发
    if (e.singleSpaTrigger === 'pushState'
      || e.singleSpaTrigger === 'replaceState'
    ) return
    console.log('浏览器返回事件', e)
    overlays.dismissAll()
    this.onBack()
    this.removePopstateListener()
  }

  getEditState = () => this.props.state.edit

  init = async (user, isMount) => {
    this.user = user
    console.log(isMount ? 'init data didmount' : 'init data receiveProp')
    // const {id} = props.match.params
    const {history, actions} = this.props
    const {userId, token} = user
    let {photos} = this.location
    if (this.search.postId) {
      this.postId = this.search.postId
      // 编辑旧帖子
      let {payload: post} = await actions.initPostEditWithPostId(this.postId, token)
      actions.deleteDraft(userId, this.draftId)
      // 找到帖子之前在编辑的草稿
      // 如果草稿中已有在编辑的草稿，提示是否打开草稿继续编辑
      let {payload: draft} = await actions.findDraftById(user.userId, this.postId)
      if (draft) {
        this.draftId = draft.draftId
        overlays.showAlert('本文有未完成的草稿，打开草稿继续编辑？', '', [
          {
            text: '打开', onPress: async () => {
              let {payload: draft} = await actions.initPostEditWithDraftId(userId, this.draftId)
              this.setState({title: draft.title})
              overlays.showToast('已加载草稿')
            }
          },
          {text: '取消'}
        ])
      }

      this.setState({title: post.title})
    } else if (this.search.draftId) {
      // 草稿
      this.draftId = this.search.draftId
      let {payload: draft} = await actions.initPostEditWithDraftId(userId, this.draftId)
      this.postId = draft._id
      // 编辑帖子时，如果帖子被删除，则删除草稿
      if (this.postId) {
        let {payload: post} = await actions.getPost(this.postId, token)
        if (post.status !== 'public' && post.status !== 'private' && post.status !== 'protect') {
          overlays.showToast('原帖已被删除，即将删除草稿')
          actions.deleteDraft(userId, this.draftId)
          setTimeout(history.goBack, 2000)
          return
        }
      }
      this.setState({title: draft.title})
    } else if (photos) {
      // 根据照片创建新帖子
      await this.props.actions.initPostEdit()
      this.onPhotoChoose(0, photos, true)
      console.log('照片', photos)
    } else {
      // 新建
      await this.props.actions.initPostEdit()
      this.openAdd(0)
    }

    // 来源于印品，隐藏底部按钮
    if (this.from === 'book') {
      this.setState({
        showBottom: false
      })
    }

    this.setState({completeBtnEnabled: true})
  }

  /**
   * @param isClick 是否认为点击，false为浏览器返回
   */
  onBack = (isClick?) => {
    const {props} = this
    const {post, error, initData} = this.getEditState()
    const {userId} = this.user
    const back = () => {
      if (isClick) {
        this.removePopstateListener()
        props.history.goBack()
      }
    }

    if (this.from === 'book') {
      back()
      return
    }

    if (error) {
      back()
      return
    }

    let newPost = cloneDeep(post)
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
      props.actions.saveDraft(userId, this.draftId || this.postId, newPost)
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
    const {post} = this.getEditState()
    const {audio_id, status, protect} = post
    overlays.show(
      <EditBottomOverlay
        token={this.user.token}
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
    let newPost = cloneDeep(post)
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
      let {userId, token} = this.user
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
      this.removePopstateListener()
      if (this.from === 'book') {
        this.props.history.goBack()
      } else {
        this.props.history.replaceToShow(result._id)
      }
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

  uploadRetry = async (media) => {
    const {body, file, type} = media
    await this.props.actions.updateMediaByBody(body, {error: null})
    this.isUploading || this.uploadNextMedia()
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
    let notUploads = post.media.filter(item =>
      (item.type === 'image' || item.type === 'shortvideo') &&
      !item.key
    )

    if (notUploads.length === 0) {
      overlays.showToast('上传完成')
      return
    }

    let nextUpload = notUploads.find(item => !item.error)
    if (!nextUpload) {
      console.log('部分上传失败')
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
    let {post} = this.getEditState()
    const {coverKey, headbacimgurl, coverHidden} = post
    if (this.uploading && this.uploading.path === data.body) {
      this.uploading.cancel()
    }
    if (headbacimgurl === data.body) {
      this.setCover('')
    }
    this.props.actions.deleteMedia(index)
  }

  choosePhoto = async (index, isImage) => {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, true)
      this.onPhotoChoose(index, data, isImage)
    } catch (e) {
      console.error(e)
      overlays.showToast(e.message)
    }
  }

  onCoverClick = async () => {
    try {
      let photos = await utils.choosePhoto(true, false)
      let photo = photos[0]
      const {file, src} = photo
      this.setCover(src)
      let uploading = await utils.uploadPhoto(src, file, null)
      let key = await uploading.start()
      this.setCover(qiniu.getOriginUrl(key), key)
    } catch (e) {
      overlays.showToast(e.message)
    }
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
          onRetry={() => this.uploadRetry(data)}
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
          <img className='cover-img' src={headbacimgurl}/>
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
    const {showBottom, completeBtnEnabled} = this.state

    if (error) {
      return (
        <div className='post-edit'>
          <NavBar title='写文章' onBack={() => this.onBack(true)}/>
          <div className='error'>{error}</div>
        </div>
      )
    }

    if (!initData || !this.user) {
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
            completeBtnEnabled
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
              value={this.state.title || ''}
              onChange={e => {
                let title = e.target.value
                this.setState({title})
                // 使用外部状态而非state时输入中文只会保留拼音
                this.props.actions.setPostState({title})
              }}
            />
            {/*<p>{post.description}</p>*/}
            {this.renderMedia(media)}
          </div>

          {showBottom ? (
            <>
              <EditBottomButtons
                audio={audio_id}
                status={status}
                onLeftClick={() => this.showBottomEdit('audio')}
                onRightClick={() => this.showBottomEdit('status')}
              />
              <div style={{height: EditBottomHeight}}/>
            </>
          ) : null}

        </div>
      </div>
    )
  }
}
