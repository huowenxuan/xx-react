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
import {pageWrapper} from '../../components/HigherOrderStatelessComponents'
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
let coverFile = null // 原生图片选择器选择图片后的file文件，设置为封面图
let overlay: any = React.createRef()
let addBtn: any = React.createRef()
let uploadCancel = false

export default pageWrapper()((props) => {
  const [openedAddItem, setOpenedAddItem] = useState(-1)
  const [post, setPost]: any = useState({
    media: [],
    coverHidden: false,
    // status: 'public'
    status: 'private'
  })
  const [upload, setUpload] = useState({
    body: '',
    percent: 0,
  })
  const [completeBtnEnabled, setCompleteBtnEnabled] = useState(true)

  useEffect(() => {
    console.log('init data')
    initData()
    return () => console.log('unmount')
  }, [])

  useEffect(() => {
  }, [post])

  useEffect(() => {
    if (openedAddItem === -1) return
    let rect = addBtn.current.getBoundingClientRect()
    let key = overlays.show(
      <EditAdd
        onDismiss={() => {
          overlays.dismiss(key)
          setOpenedAddItem(-1)
        }}
        rect={rect}
        onText={() => onAddClick(MediaTypes.Text, openedAddItem)}
        onImage={() => onAddClick(MediaTypes.Image, openedAddItem)}
        onLink={() => onAddClick(MediaTypes.Link, openedAddItem)}
        onVideo={() => onAddClick(MediaTypes.Video, openedAddItem)}
      />
    )
  }, [openedAddItem])

  const initData = async () => {
    postId = ''
    coverFile = null
    uploadCancel = false
    draftId = ''

    // const {id} = props.match.params
    let {photos, search} = props.location
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
      setPost(postData)
    } else if (photos) {
      // 根据照片创建新帖子
      onPhotoChoose(0, photos, true)
      console.log('照片', photos)
    } else if (search.draftId) {
      // 草稿
      draftId = search.draftId
      let {payload: draft} = await props.actions.findDraftById(1, draftId)
      console.log('草稿', draft)
      setPost(draft)
    } else {
      // 新建
      openAdd(0)
    }
  }

  const onBack = () => {
    if (!post.title && (!post.media || post.media.length === 0)) {
      props.history.goBack()
      return
    }

    const saveAndBack = () => {
      props.history.goBack()
      props.actions.saveDraft(1, draftId, post)
    }
    overlays.showAlert('是否保存草稿', '', [
      {text: '放弃更改', onPress: () => props.history.goBack()},
      {text: '保存草稿', onPress: () => saveAndBack()},
    ], {showClose: true})
  }

  // 弹出选择图片和权限遮罩
  const showBottomEdit = (type) => {
    const {audio_id, status, protect} = post
    overlays.show(
      <EditBottomOverlay
        type={type}
        audio={audio_id}
        status={status}
        protect={protect}
        onUpdate={setPostState}
      />
    )
  }

  const setPostState = (field, data) => {
    setPost(prevPost => ({
      ...prevPost,
      [field]: data
    }))
  }

  const cancelUpload = () => {
    overlays.showAlert('是否取消上传', '', [
      {text: '取消'},
      {text: '确定', onPress: () => uploadCancel = true}
    ])
  }

  const complete = async () => {
    const {media} = post

    if (!post.title) {
      overlays.showToast('请输入标题')
      return
    }
    if (post.media.length === 0) {
      overlays.showToast('请添加图片或者文字')
      return
    }
    setCompleteBtnEnabled(false)
    let newPost = _.cloneDeep(post)
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
    let result
    try {
      if (postId) {
        result = await request.post(request.API.postUpdate + postId, {data}, Token)
        overlays.showToast('更新成功')
      } else {
        result = await request.post(request.API.postCreate, {data}, Token)
        overlays.showToast('创建成功')
      }
      draftId && props.actions.removeDraft(1, draftId)
      console.log(result)
      console.log(result._id)
      // props.history.replace(`/postedit?postId=${result._id}`)
      window.location.href = `/postedit?postId=${result._id}`
    } catch (e) {
      overlays.showToast(e.message)
      setCompleteBtnEnabled(true)
    }
    setCompleteBtnEnabled(true)
  }

  const insertMedias = (index, medias) => {
    const {media = []} = post
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(...medias)
    let newMedia = arr1.concat(arr2)
    setPostState('media', newMedia)
  }

  const updateMedia = (index, updateParams) => {
    const {media} = post
    media[index] = {
      ...media[index],
      ...updateParams
    }
    setPostState('media', media)
    if (updateParams.isCover) {
      setItemToCover(index, media[index])
    }
  }

  // 把某项media设置为封面图
  const setItemToCover = (index, item) => {
    setPostState('headbacimgurl', item.body)
    setPostState('coverKey', item.key)
  }

  const clickMedia = (data, index) => {
    showAddOverlay(data.type, index, false)
  }

  const del = (index) => {
    let {media} = post
    media.splice(index, 1)
    setPostState('media', media)
  }

  const up = (index) => {
    let {media} = post
    if (index === 0) return
    [media[index - 1], media[index]] = [media[index], media[index - 1]]
    setPostState('media', media)
  }

  const down = (index) => {
    let {media} = post
    if (index === media.length - 1) return
    [media[index], media[index + 1]] = [media[index + 1], media[index]]
    setPostState('media', media)
  }

  const openAdd = (index) => {
    setOpenedAddItem(index)
  }

  const mediaIsCover = (item) => {
    const {headbacimgurl, coverKey} = post
    if (!item) return false
    if (headbacimgurl === item.body) return true
    if (coverKey && coverKey === item.key) return true
    return false
  }

  /* 处理选择后的图片 */
  const onPhotoChoose = async (index, photos, isImage) => {
    if (!photos || photos.length === 0) return
    // 如果没封面，就把第一张设为封面
    if (isImage && !post.headbacimgurl && !post.coverKey) {
      setLocalImageToCover(photos[0].src, photos[0].file)
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

    insertMedias(index, insertData)

    for (let {body, file} of insertData) {
      let key = await new Promise(async (resolve, reject) => {
        let timer, uploading
        const error = (e) => reject(e)
        // 检查是否点击了取消
        timer = setInterval(() => {
          if (uploadCancel) {
            uploading && uploading.cancel()
            error(new Error('cancel'))
          }
        }, 300)
        try {
          setUpload({body, percent: 0})
          uploading = await utils.uploadPhoto(
            body,
            file,
            (percent) => {
              console.log(percent)
              setUpload((prev) => ({...prev, percent}))
            }
          )
          let key = await uploading.start()
          setUpload((prev) => ({...prev, percent: 100}))
          resolve(key)
        } catch (e) {
          error(e)
        } finally {
          timer && clearInterval(timer)
        }
      })
      setPost((prevPost) => ({
        ...prevPost,
        media: prevPost.media.map(item => {
          if (item.body === body) {
            item.key = key
            item.body = item.type === 'image'
              ? qiniu.getImageUrl(key)
              : qiniu.getOriginUrl(key)
            if (prevPost.headbacimgurl === body) {
              setPostState('coverKey', key)
              setPostState('headbacimgurl', item.body)
            }
          }
          return item
        })
      }))
    }
  }

  const choosePhoto = async (index, isImage) => {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, true)
      onPhotoChoose(index, data, isImage)
    } catch (e) {
      overlays.showToast(e.message)
    }
  }

  const onCoverClick = async () => {
    let photos = await utils.choosePhoto(true, false)
    let photo = photos[0]
    const {file, src} = photo
    setLocalImageToCover(src, file)
  }

  const setLocalImageToCover = (src, file) => {
    setPostState('headbacimgurl', src)
    setPostState('coverKey', '')
    coverFile = file
  }

  const onAddClick = (type, index) => {
    if (type === MediaTypes.Image) {
      choosePhoto(index, true)
    } else if (type === MediaTypes.Video) {
      overlays.showActionSheet([
        {text: '本地', onPress: () => choosePhoto(index, false)},
        {text: '网络', onPress: () => showAddOverlay(type, index, true)},
      ])
    } else {
      showAddOverlay(type, index, true)
    }
  }

  const renderAddItem = (index) => {
    return (
      <div
        ref={openedAddItem === index ? addBtn : null}
        className='add-row'
        onClick={() => openAdd(index)}
      >
        <img className='icon' src={images.add_spe_icon}/>
      </div>
    )
  }

  const renderMedia = (media) => {
    if (!media || media.length === 0) return renderAddItem(0)

    return media.map((data, index) => (
      // 每个item的key不变可保证每次修改元素后所有的视频不重新加载
      <ul key={`${data._id}-${data.body}`}>
        {renderAddItem(index)}
        <EditMediaItem
          progress={upload.body === data.body ? upload.percent : 0}
          isCover={mediaIsCover(data)}
          data={data}
          onClick={() => clickMedia(data, index)}
          onDelete={() => del(index)}
          onUp={() => up(index)}
          onDown={() => down(index)}
          onSetCover={() => setItemToCover(index, data)}
        />
        {index === media.length - 1
          ? renderAddItem(index + 1)
          : null}
      </ul>
    ))
  }

  const showAddOverlay = (type, index, isNew) => {
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
          ref={overlay}
          data={curData}
          isCover={mediaIsCover(curData)}
          onChange={(data) => {
            overlays.dismiss(key)
            if (isNew) insertMedias(index, [data])
            else updateMedia(index, data)
          }}
          onCancel={() => overlays.dismiss(key)}
        />
      </OverlayViewFade>
    )
  }

  const renderCover = () => {
    const {coverKey, headbacimgurl, coverHidden} = post
    if (!headbacimgurl) {
      return (
        <div
          onClick={onCoverClick}
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
              onClick={() => setPostState('coverHidden', true)}
              className='remove'>
              <img className='remove-img' src={images.edit_remove_icon}/>
            </button>
            <button
              onClick={onCoverClick}
              className='update'>
              更改封面
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div
          onClick={() => setPostState('coverHidden', false)}
          className='edit-cover-hidden'
        >
          <img className='img' src={headbacimgurl}/>
          显示封面
        </div>
      )
    }
  }

  const {title, media, audio_id, status} = post
  return (
    <div>
      <NavBar
        title='写文章'
        onBack={onBack}
        rightButtons={[
          completeBtnEnabled
            ? {text: '完成', onClick: complete}
            : {text: ''},
        ]}
      />

      <div className='post-edit'>
        {renderCover()}
        <div id='wrapper'>
          <input
            className='title-input'
            placeholder="输入标题(2-50字)"
            value={title || ''}
            onChange={e => setPostState('title', e.target.value)}
          />
          {/*<p>{post.description}</p>*/}
          {renderMedia(media)}
        </div>

        <EditBottomButtons
          audio={audio_id}
          status={status}
          onLeftClick={() => showBottomEdit('audio')}
          onRightClick={() => showBottomEdit('status')}
        />
        <div style={{height: EditBottomHeight}}/>
      </div>
    </div>
  )
})