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

const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
const MediaTypes = {
  None: null,
  Text: 'text',
  Image: 'image',
  Link: 'link',
  Video: 'video'
}

let postId = ''
let _coverFile = null // 原生图片选择器选择图片后的file文件，设置为封面图
let overlay: any = React.createRef()
let addBtn: any = React.createRef()
let _uploadCancel = false

export default (props) => {
  const [openedAddItem, setOpenedAddItem] = useState(-1)
  const [post, setPost]: any = useState({
    media: [],
    coverHidden: false,
    // status: 'public'
    status: 'private'
  })
  const [upload, setUpload] = useState({
    show: false,
    currentIndex: 0,
    currentPercent: 0,
    count: 0,
    percent: 0
  })
  const [completeBtnEnabled, setCompleteBtnEnabled] = useState(true)

  useEffect(() => {
    _initData()
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
        onText={() => _onAddClick(MediaTypes.Text, openedAddItem)}
        onImage={() => _onAddClick(MediaTypes.Image, openedAddItem)}
        onLink={() => _onAddClick(MediaTypes.Link, openedAddItem)}
        onVideo={() => _onAddClick(MediaTypes.Video, openedAddItem)}
      />
    )
  }, [openedAddItem])

  const _initData = async () => {
    const {id} = props.match.params
    const {photos} = props.location
    if (id) {
      postId = id
      // 编辑旧帖子
      let data = await request.get(request.API.postEdit + id, {}, Token)
      let postData = data.post
      const {media} = postData
      for (let item of media) {
        const {info, type, style} = item
        if (type === 'image') {
          item.info = utils.toJson(info)
          item.style = utils.toJson(style)
        }
      }
      console.log('postData', postData)
      setPost(postData)
    } else if (photos) {
      // 根据照片创建新帖子
      _onPhotoChoose(0, photos, true)
    } else {
      _openAdd(0)
    }
  }

  // 弹出选择图片和权限遮罩
  const _showBottomEdit = (type) => {
    const {audio_id, status, protect} = post
    overlays.show(
      <EditBottomOverlay
        type={type}
        audio={audio_id}
        status={status}
        protect={protect}
        onUpdate={_setPostState}
      />
    )
  }

  const _setPostState = (field, data) => {
    setPost(prevPost => ({
      ...prevPost,
      [field]: data
    }))
  }

  const _resetProgress = () => {
    setUpload({
      show: false,
      currentIndex: 0,
      currentPercent: 0,
      count: 0,
      percent: 0
    })
  }

  const _cancelUpload = () => {
    overlays.showAlert('是否取消上传', '', [
      {text: '取消'},
      {text: '确定', onPress: () => _uploadCancel = true}
    ])
  }

  const _uploadFiles = async (media) => {
    _uploadCancel = false

    let uploadMedias = []
    for (let i = 0; i < media.length; i++) {
      let item = media[i]
      let {type, body, key} = item
      if (
        !key && (
          type === 'image' ||
          type === 'shortvideo'
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
    const {headbacimgurl, coverKey} = post
    if (!coverKey && headbacimgurl && !uploadMedias.find(i => i.item.body === headbacimgurl)) {
      uploadMedias.unshift({
        index: -1,
        isCover: true,
        item: {
          file: _coverFile,
          body: headbacimgurl
        }
      })
    }

    let uploadCount = uploadMedias.length
    if (uploadCount > 0) {
      setUpload({
        show: true,
        count: uploadCount,
        percent: 0,
        currentIndex: 0,
        currentPercent: 0
      })
    }
    for (let i = 0; i < uploadMedias.length; i++) {
      let beforeDate = new Date()
      let {index, item, isCover} = uploadMedias[i]
      setUpload((prevUpload) => ({
        ...prevUpload,
        currentIndex: i,
        currentPercent: 0,
        percent: (i / uploadCount) * 100
      }))
      const {body, file} = item
      let key = await new Promise(async (resolve, reject) => {
        let timer, uploading
        const error = (e) => reject(e)
        // 检查是否点击了取消
        timer = setInterval(() => {
          if (_uploadCancel) {
            uploading && uploading.cancel()
            error(new Error('cancel'))
          }
        }, 300)
        const onProgress = (percent) => {
          console.log(percent)
          setUpload((prevUpload) => ({
            ...prevUpload,
            currentPercent: percent,
            percent: ((i / uploadCount) * 100) + (percent / uploadCount)
          }))
        }
        try {
          uploading = await utils.uploadPhoto(body, file, onProgress)
          let key = await uploading.start()
          setUpload((prevUpload) => ({
            ...prevUpload,
            currentPercent: 100,
            percent: ((i / uploadCount) * 100) + (100 / uploadCount)
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
        _setPostState('coverKey', key)
      } else {
        console.log('上传完成 ', key)
        _updateMedia(index, {key})
      }
    }
    _resetProgress()
  }


  const _complete = async () => {
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
    try {
      await _uploadFiles(media)
    } catch (e) {
      setCompleteBtnEnabled(true)
      if (e.message === 'cancel') {
        overlays.showToast('取消上传')
      } else {
        console.error(e)
        overlays.showAlert('上传失败，是否重新上传？', '', [
          {text: '确定', onPress: async () => _complete()},
          {type: 'cancel'},
        ])
      }
      return
    }

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
      console.log(result)
      console.log(result._id)
    } catch (e) {
      overlays.showToast(e.message)
      setCompleteBtnEnabled(true)
    }
    setCompleteBtnEnabled(true)
  }

  const _insertMedias = (index, medias) => {
    const {media} = post
    let arr1 = media.slice(0, index)
    let arr2 = media.slice(index, media.length + 1)
    arr1.push(...medias)
    let newMedia = arr1.concat(arr2)
    _setPostState('media', newMedia)
  }

  const _updateMedia = (index, updateParams) => {
    const {media} = post
    media[index] = {
      ...media[index],
      ...updateParams
    }
    _setPostState('media', media)
    if (updateParams.isCover) {
      _setItemToCover(index, media[index])
    }
  }

  // 把某项media设置为封面图
  const _setItemToCover = (index, item) => {
    _setPostState('headbacimgurl', item.body)
    _setPostState('coverKey', item.key)
  }

  const _clickMedia = (data, index) => {
    _showAddOverlay(data.type, index, false)
  }

  const _del = (index) => {
    let {media} = post
    media.splice(index, 1)
    _setPostState('media', media)
  }

  const _up = (index) => {
    let {media} = post
    if (index === 0) return
    [media[index - 1], media[index]] = [media[index], media[index - 1]]
    _setPostState('media', media)
  }

  const _down = (index) => {
    let {media} = post
    if (index === media.length - 1) return
    [media[index], media[index + 1]] = [media[index + 1], media[index]]
    _setPostState('media', media)
  }

  const _openAdd = (index) => {
    setOpenedAddItem(index)
  }

  const _mediaIsCover = (item) => {
    const {headbacimgurl, coverKey} = post
    if (!item) return false
    if (headbacimgurl === item.body) return true
    if (coverKey && coverKey === item.key) return true
    return false
  }

  const _onPhotoChoose = (index, photos, isImage) => {
    if (!photos || photos.length === 0) return
    // 如果没封面，就把第一张设为封面
    if (isImage && !post.headbacimgurl && !post.coverKey) {
      _setLocalImageToCover(photos[0].src, photos[0].file)
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
    _insertMedias(index, insertData)
  }

  const _choosePhoto = async (index, isImage) => {
    let data = null
    try {
      data = await utils.choosePhoto(isImage, true)
      return _onPhotoChoose(index, data, isImage)
    } catch (e) {
      overlays.showToast(e.message)
      return
    }
  }

  const _onCoverClick = async () => {
    let photos = await utils.choosePhoto(true, false)
    let photo = photos[0]
    const {file, src} = photo
    _setLocalImageToCover(src, file)
  }

  const _setLocalImageToCover = (src, file) => {
    _setPostState('headbacimgurl', src)
    _setPostState('coverKey', '')
    _coverFile = file
  }

  const _onAddClick = (type, index) => {
    if (type === MediaTypes.Image) {
      _choosePhoto(index, true)
    } else if (type === MediaTypes.Video) {
      overlays.showActionSheet([
        {text: '本地', onPress: () => _choosePhoto(index, false)},
        {text: '网络', onPress: () => _showAddOverlay(type, index, true)},
      ])
    } else {
      _showAddOverlay(type, index, true)
    }
  }

  const _onOverlayChange = (data, index, isNew) => {
    if (isNew)
      _insertMedias(index, [data])
    else
      _updateMedia(index, data)
  }

  const _renderAddItem = (index) => {
    return (
      <div
        ref={openedAddItem === index ? addBtn : null}
        className='add-row'
        onClick={() => _openAdd(index)}
      >
        <img className='icon' src={images.add_spe_icon}/>
      </div>
    )
  }

  const _renderMedia = (media) => {
    const {coverKey, headbacimgurl} = post
    if (!media || media.length === 0) {
      return _renderAddItem(0)
    }
    return media.map((data, index) => (
      // 每个item的key不变可保证每次修改元素后所有的视频不重新加载
      <ul key={`${data._id}-${data.body}`}>
        {_renderAddItem(index)}
        <EditMediaItem
          isCover={_mediaIsCover(data)}
          data={data}
          onClick={() => _clickMedia(data, index)}
          onDelete={() => _del(index)}
          onUp={() => _up(index)}
          onDown={() => _down(index)}
          onSetCover={() => _setItemToCover(index, data)}
        />
        {index === media.length - 1
          ? _renderAddItem(index + 1)
          : null}
      </ul>
    ))
  }

  const _showAddOverlay = (type, index, isNew) => {
    let curData = isNew ? null : post.media[index]
    let OverlayView = null
    switch (type) {
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

    let key = overlays.show(
      <OverlayViewFade>
        <OverlayView
          ref={overlay}
          data={curData}
          isCover={_mediaIsCover(curData)}
          onChange={(data) => {
            _onOverlayChange(data, index, isNew)
            overlays.dismiss(key)
          }}
          onCancel={() => overlays.dismiss(key)}
        />
      </OverlayViewFade>
    )
  }

  const _renderCover = () => {
    const {coverKey, headbacimgurl, coverHidden} = post
    if (!headbacimgurl) {
      return (
        <div
          onClick={_onCoverClick}
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
              onClick={() => _setPostState('coverHidden', true)}
              className='remove'>
              <img className='remove-img' src={images.edit_remove_icon}/>
            </button>
            <button
              onClick={_onCoverClick}
              className='update'>
              更改封面
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div
          onClick={() => _setPostState('coverHidden', false)}
          className='edit-cover-hidden'
        >
          <img className='img' src={headbacimgurl}/>
          显示封面
        </div>
      )
    }
  }

  const _renderPercent = () => {
    const {
      currentIndex,
      currentPercent,
      count,
      percent,
      show
    } = upload
    if (!show) return null

    return (
      <div className='percent'>
        <div className='child'>
          <p>正在上传第{currentIndex + 1}张{parseInt(currentPercent.toString())}%，共{count}张</p>
          <button
            className='cancel'
            onClick={_cancelUpload}
          >
            取消上传
          </button>
        </div>
      </div>
    )
  }

  const {title, media, audio_id, status} = post
  return (
    <div>
      <NavBar
        title='写文章'
        onBack={props.history.goBack}
        rightButtons={[
          completeBtnEnabled
            ? {text: '完成', onClick: _complete}
            : {text: ''},
        ]}
      />

      <div className='post-edit'>
        {_renderCover()}
        <div id='wrapper'>
          <input
            className='title-input'
            placeholder="输入标题(2-50字)"
            value={title || ''}
            onChange={e => _setPostState('title', e.target.value)}
          />
          {/*<p>{post.description}</p>*/}
          {_renderMedia(media)}
        </div>

        <EditBottomButtons
          audio={audio_id}
          status={status}
          onLeftClick={() => _showBottomEdit('audio')}
          onRightClick={() => _showBottomEdit('status')}
        />
        <div style={{height: EditBottomHeight}}/>
        {_renderPercent()}
      </div>
    </div>
  )
}