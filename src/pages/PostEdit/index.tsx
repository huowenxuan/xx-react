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

const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
const MediaTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

let postId = ''
let draftId = ''
let initData = null // 初始化数据，用于比对是否修改过

let addBtn: any = React.createRef() // 当前点击的加号按钮
let uploading // 正在上传的对象
let isUploading = false // 是否正在上传

@pageWrapper()
export default class Page extends PureComponent {
  props: any
  state: any

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
      completeBtnEnabled: true
    }
  }

  componentDidMount() {
    console.log('init data')
    this.init()
    window.addEventListener("popstate", this.onPopstate, false)
  }

  removePopstateListener = () => {
    console.log('remove popstate listener')
    window.removeEventListener('popstate', this.onPopstate)
  }

  onPopstate = () => {
    console.log('浏览器返回事件')
    this.onBack()
  }

  setStateSync = async (handle) => {
    return new Promise(resolve => {
      this.setState(handle, resolve)
    })
  }

  init = async () => {
    postId = ''
    draftId = ''
    initData = null
    // const {id} = props.match.params
    let {photos, search} = this.props.location
    search = qs.decode(search.substr(1))

    if (search.postId) {
      // 编辑
      postId = search.postId
      // 编辑旧帖子
      let data = await request.get(request.API.postEdit + postId, {}, Token)
      let postData = data.post
      const {media} = postData
      for (let item of media) {
        const {info, type, style} = item
        if (type === 'image') {
          item.info = utils.toJson(info)
          item.style = utils.toJson(style)
        }
      }
      console.log('编辑', postData)
      this.setState({post: postData})
      initData = _.cloneDeep(postData)
    } else if (photos) {
      // 根据照片创建新帖子
      this.onPhotoChoose(0, photos, true)
      console.log('照片', photos)
    } else if (search.draftId) {
      // 草稿
      draftId = search.draftId
      let {payload: draft} = await this.props.actions.findDraftById(1, draftId)
      console.log('草稿', draft)
      this.setState({post: draft})
      initData = _.cloneDeep(draft)
    } else {
      // 新建
      this.openAdd(0)
    }
  }

  onBack = (isClick?) => {
    const {props} = this
    const {post} = this.state
    let newPost = _.cloneDeep(post)
    // 过滤掉没有key的图片和视频
    newPost.media = newPost.media.filter(item => {
      if ((item.type === 'image' || item.type === 'shortvideo') &&
        !item.key
      ) return false
      return true
    })

    const back = () => {
      this.removePopstateListener()
      // 人为点击返回则需要返回，浏览器返回不需要
      isClick && props.history.goBack()
    }
    const deleteAndBack = () => {
      back()
      props.actions.deleteDraft(1, draftId)
    }
    const saveAndBack = () => {
      back()
      props.actions.saveDraft(1, draftId, newPost)
    }

    if (JSON.stringify(newPost) === JSON.stringify(initData)) {
      console.log('数据未修改，无需保存')
      back()
      return
    }

    if (!newPost.title && (!newPost.media || newPost.media.length === 0)) {
      if (draftId) {
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
        type={type}
        audio={audio_id}
        status={status}
        protect={protect}
        onUpdate={this.setPostState}
      />
    )
  }

  setPostState = (field, data) => {
    this.setState((prev: any) => ({
      post: {
        ...prev.post,
        [field]: data
      }
    }))
  }

  complete = async () => {
    const {post} = this.state
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
      if (postId) {
        result = await request.post(request.API.postUpdate + postId, {data}, Token)
        overlays.showToast('更新成功')
      } else {
        result = await request.post(request.API.postCreate, {data}, Token)
        overlays.showToast('创建成功')
      }
      draftId && this.props.actions.deleteDraft(1, draftId)
      console.log(result)
      console.log(result._id)
      // props.history.replace(`/postedit?postId=${result._id}`)
      window.location.href = `/postedit?postId=${result._id}`
    } catch (e) {
      overlays.showToast(e.message)
    } finally {
      this.setState({completeBtnEnabled: true})
    }
  }

  insertMedias = async (index, medias) => {
    let newPost: any = await this.getNewestPost()
    const {media = []} = newPost
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(...medias)
    let newMedia = arr1.concat(arr2)
    this.setPostState('media', newMedia)
  }

  updateMediaByIndex = async (index, updateParams) => {
    this.setState(({post}: any) => {
      const {media} = post
      media[index] = {
        ...media[index],
        ...updateParams
      }
      if (updateParams.isCover) {
        this.setCover(media[index].body, media[index].key)
      }
      return {post: {...post, media}}
    })
  }

  clickMedia = (data, index) => {
    this.showAddOverlay(data.type, index, false)
  }

  del = (index) => {
    this.setState(({post}: any) => {
      let {media} = post
      media.splice(index, 1)
      return {post: {...post, media}}
    })
  }

  up = (index) => {
    this.setState(({post}: any) => {
      let {media} = post
      if (index === 0) return
      [media[index - 1], media[index]] = [media[index], media[index - 1]]
      return {post: {...post, media}}
    })
  }

  down = (index) => {
    this.setState(({post}: any) => {
      let {media} = post
      if (index === media.length - 1) return
      [media[index], media[index + 1]] = [media[index + 1], media[index]]
      return {post: {...post, media}}
    })
  }

  openAdd = (index) => {
    this.setState({
      openedAddItem: index
    }, () => {
      if (index === -1) return
      let rect = addBtn.current.getBoundingClientRect()
      let key = overlays.show(
        <EditAdd
          onDismiss={() => {
            overlays.dismiss(key)
            this.setState({openedAddItem: -1})
          }}
          rect={rect}
          onText={() => this.onAddClick(MediaTypes.Text, this.state.openedAddItem)}
          onImage={() => this.onAddClick(MediaTypes.Image, this.state.openedAddItem)}
          onLink={() => this.onAddClick(MediaTypes.Link, this.state.openedAddItem)}
          onVideo={() => this.onAddClick(MediaTypes.Video, this.state.openedAddItem)}
        />
      )
    })
  }

  getNewestPost = () => {
    // TODO 删掉
    return this.state.post
  }

  updateMediaByBody = async (body, cb) => {
    let newPost: any = await this.getNewestPost()
    let media = newPost.media.map(item => {
      if (item.body === body) {
        item = {
          ...item,
          ...cb(item, newPost)
        }
      }
      return item
    })
    this.setState({
      post: {...newPost, media}
    })
  }

  uploadMedia = async (media) => {
    const {body, file} = media
    this.updateMediaByBody(body, () => ({error: null}))
    await new Promise(async (resolve, reject) => {
      try {
        this.setState({upload: {body, percent: 0}})
        uploading = await utils.uploadPhoto(
          body,
          file,
          (percent) => {
            console.log(percent)
            this.setState(({upload}: any) => ({
              upload: {...upload, percent}
            }))
          }
        )
        let key = await uploading.start()
        this.setState(({upload}: any) => ({
          upload: {...upload, percent: 100}
        }))
        await this.updateMediaByBody(body, (item, newPost) => {
          let newBody = item.type === 'image'
            ? qiniu.getImageUrl(key)
            : qiniu.getOriginUrl(key)
          if (newPost.headbacimgurl === body) {
            this.setPostState('coverKey', key)
            this.setPostState('headbacimgurl', newBody)
          }
          return {key, body: newBody}
        })
        resolve()
      } catch (e) {
        console.error('upload error', media, e)
        await this.updateMediaByBody(body, () => ({error: e.message}))
        resolve()
      }
    })
  }

  /* 递归上传，每次都从上往下找未上传和未出错的 */
  uploadNextMedia = async () => {
    console.log('开始查找需要上传的内容')
    isUploading = true
    let newPost: any = await this.getNewestPost()
    let nextUpload = newPost.media.find(item =>
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
    isUploading = false
  }


  mediaIsCover = (item) => {
    const {headbacimgurl, coverKey} = this.state.post
    if (!item) return false
    if (headbacimgurl === item.body) return true
    if (coverKey && coverKey === item.key) return true
    return false
  }

  /* 处理选择后的图片 */
  onPhotoChoose = async (index, photos, isImage) => {
    const {post} = this.state
    if (!photos || photos.length === 0) return
    // 如果没封面，就把第一张设为封面
    if (isImage && !post.headbacimgurl && !post.coverKey) {
      this.setCover(photos[0].src)
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
    await this.insertMedias(index, insertData)
    isUploading || this.uploadNextMedia()
  }

  cancelUpload = (index, data) => {
    if (uploading && uploading.path === data.body) {
      uploading.cancel()
    }
    this.del(index)
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

  setCover = (body, key = '') => {
    this.setPostState('headbacimgurl', body)
    this.setPostState('coverKey', key)
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
        ref={this.state.openedAddItem === index ? addBtn : null}
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
          onDelete={() => this.del(index)}
          onUp={() => this.up(index)}
          onDown={() => this.down(index)}
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
    let curData = isNew ? null : this.state.post.media[index]
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
            if (isNew) this.insertMedias(index, [data])
            else this.updateMediaByIndex(index, data)
          }}
          onCancel={() => overlays.dismiss(key)}
        />
      </OverlayViewFade>
    )
  }

  renderCover = () => {
    const {coverKey, headbacimgurl, coverHidden} = this.state.post
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
          <img
            className='cover'
            src={headbacimgurl}
          />
          <div className='wrapper'>
            <button
              onClick={() => this.setPostState('coverHidden', true)}
              className='remove'>
              <img className='remove-img' src={images.edit_remove_icon}/>
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
          onClick={() => this.setPostState('coverHidden', false)}
          className='edit-cover-hidden'
        >
          <img className='img' src={headbacimgurl}/>
          显示封面
        </div>
      )
    }
  }

  render() {
    const {title, media, audio_id, status} = this.state.post
    return (
      <div>
        <NavBar
          title='写文章'
          onBack={() => this.onBack(true)}
          rightButtons={[
            this.state.completeBtnEnabled
              ? {text: '完成', onClick: this.complete}
              : {text: ''},
          ]}
        />

        <div className='post-edit'>
          {this.renderCover()}
          <div id='wrapper'>
            <input
              className='title-input'
              placeholder="输入标题(2-50字)"
              value={title || ''}
              onChange={e => this.setPostState('title', e.target.value)}
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
