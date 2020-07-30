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
let initData = null // 初始化数据，用于比对是否修改过

let addBtn: any = React.createRef() // 当前点击的加号按钮
let uploading // 正在上传的对象
let isUploading = false // 是否正在上传

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
    init()
    window.addEventListener("popstate", onPopstate, false);
    return () => {
      console.log('unmount')
    }
  }, [])

  const onPopstate = ()=>{
    console.log('浏览器返回事件')
    window.removeEventListener('popstate', onPopstate)
    onBack()
  }

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

  const init = async () => {
    postId = ''
    draftId = ''
    initData = null
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
      initData = _.cloneDeep(postData)
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
      initData = _.cloneDeep(draft)
    } else {
      // 新建
      openAdd(0)
    }
  }

  const onBack = () => {
    let newPost = _.cloneDeep(post)
    // 过滤掉没有key的图片和视频
    newPost.media = newPost.media.filter(item=>{
      if ((item.type === 'image' || item.type === 'shortvideo') &&
        !item.key
      ) return false
      return true
    })
    console.log(post)

    const back = () => props.history.goBack()
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

  const complete = async () => {
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
    setCompleteBtnEnabled(false)
    try {
      if (postId) {
        result = await request.post(request.API.postUpdate + postId, {data}, Token)
        overlays.showToast('更新成功')
      } else {
        result = await request.post(request.API.postCreate, {data}, Token)
        overlays.showToast('创建成功')
      }
      draftId && props.actions.deleteDraft(1, draftId)
      console.log(result)
      console.log(result._id)
      // props.history.replace(`/postedit?postId=${result._id}`)
      window.location.href = `/postedit?postId=${result._id}`
    } catch (e) {
      overlays.showToast(e.message)
    } finally {
      setCompleteBtnEnabled(true)
    }
  }

  const insertMedias = async (index, medias) => {
    let newPost: any = await getNewestPost()
    const {media = []} = newPost
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(...medias)
    let newMedia = arr1.concat(arr2)
    setPostState('media', newMedia)
  }

  const updateMediaByIndex = async (index, updateParams) => {
    setPost(newPost => {
      const {media} = newPost
      media[index] = {
        ...media[index],
        ...updateParams
      }
      if (updateParams.isCover) {
        setCover(media[index].body, media[index].key)
      }
      return {
        ...newPost,
        media
      }
    })
  }

  const clickMedia = (data, index) => {
    showAddOverlay(data.type, index, false)
  }

  const del = (index) => {
    setPost((newPost) => {
      let {media} = newPost
      media.splice(index, 1)
      return {...newPost, media}
    })
  }

  const up = (index) => {
    setPost((newPost) => {
      let {media} = newPost
      if (index === 0) return newPost
        [media[index - 1], media[index]] = [media[index], media[index - 1]]
      return {...newPost, media}
    })
  }

  const down = (index) => {
    setPost((newPost) => {
      let {media} = newPost
      if (index === media.length - 1) return newPost
        [media[index], media[index + 1]] = [media[index + 1], media[index]]
      return {...newPost, media}
    })
  }

  const openAdd = (index) => {
    setOpenedAddItem(index)
  }

  const getNewestPost = () => {
    return new Promise(resolve => {
      setPost((prevPost) => {
        resolve(prevPost)
        return prevPost
      })
    })
  }

  const updateMediaByBody = async (body, cb) => {
    let newPost: any = await getNewestPost()
    let media = newPost.media.map(item => {
      if (item.body === body) {
        item = {
          ...item,
          ...cb(item, newPost)
        }
      }
      return item
    })
    setPost({...newPost, media})
  }

  const uploadMedia = async (media) => {
    const {body, file} = media
    updateMediaByBody(body, () => ({error: null}))
    await new Promise(async (resolve, reject) => {
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
        await updateMediaByBody(body, (item, newPost) => {
          let newBody = item.type === 'image'
            ? qiniu.getImageUrl(key)
            : qiniu.getOriginUrl(key)
          if (newPost.headbacimgurl === body) {
            setPostState('coverKey', key)
            setPostState('headbacimgurl', newBody)
          }
          return {key, body: newBody}
        })
        resolve()
      } catch (e) {
        console.error('upload error', media, e)
        await updateMediaByBody(body, () => ({error: e.message}))
        resolve()
      }
    })
  }

  /* 递归上传，每次都从上往下找未上传和未出错的 */
  const uploadNextMedia = async () => {
    console.log('开始查找需要上传的内容')
    isUploading = true
    let newPost: any = await getNewestPost()
    let nextUpload = newPost.media.find(item =>
      (item.type === 'image' || item.type === 'shortvideo') &&
      !item.key &&
      !item.error
    )
    if (!nextUpload) {
      console.log('全部上传完成')
      return
    }

    await uploadMedia(nextUpload)
    await uploadNextMedia()
    isUploading = false
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
      setCover(photos[0].src)
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
    await insertMedias(index, insertData)
    isUploading || uploadNextMedia()
  }

  const cancelUpload = (index, data) => {
    if (uploading && uploading.path === data.body) {
      uploading.cancel()
    }
    del(index)
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
    setCover(src)
    let uploading = await utils.uploadPhoto(src, file, null)
    let key = await uploading.start()
    setCover(qiniu.getOriginUrl(key), key)
  }

  const setCover = (body, key = '') => {
    setPostState('headbacimgurl', body)
    setPostState('coverKey', key)
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
          upload={{
            progress: upload.body === data.body ? upload.percent : 0,
            error: data.error
          }}
          isCover={mediaIsCover(data)}
          data={data}
          onClick={() => clickMedia(data, index)}
          onDelete={() => del(index)}
          onUp={() => up(index)}
          onDown={() => down(index)}
          onSetCover={() => setCover(data.body, data.key)}
          onRetry={() => uploadMedia(data)}
          onCancel={() => cancelUpload(index, data)}
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
          data={curData}
          isCover={mediaIsCover(curData)}
          onChange={(data) => {
            overlays.dismiss(key)
            if (isNew) insertMedias(index, [data])
            else updateMediaByIndex(index, data)
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
            <button onClick={onCoverClick} className='update'>
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