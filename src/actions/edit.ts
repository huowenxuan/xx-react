'use strict'

import * as types from './actionTypes'
import {createAction} from 'redux-actions'
import * as request from '../request'
import * as utils from '../utils'

import {_findDraftById} from './draft'

const {API} = request

const _getPost = async (postId, token) => {
  let data = await request.get(API.postEdit + postId, {}, token)
  let {post} = data
  const {media} = post
  for (let item of media) {
    const {info, type, style} = item
    if (type === 'image') {
      item.info = utils.toJson(info)
      item.style = utils.toJson(style)
    }
  }
  return post
}

export const getPost = createAction('', async (postId, token) => {
  let post = await _getPost(postId, token)
  return post
})

export const initPostEditWithPostId = createAction(types.EDIT_INIT, async (postId, token) => {
  let post = await _getPost(postId, token)
  console.log('编辑', post)
  if (post.status !== 'public' && post.status !== 'private' && post.status !== 'protect') {
    throw new Error('帖子不存在')
  } else {
    return post
  }
})

export const initPostEditWithDraftId = createAction(types.EDIT_INIT, async (userId, draftId) => {
  let draft = _findDraftById(userId, draftId)
  if (!draft) throw new Error('草稿已删除')
  console.log('草稿', draft)
  return draft
})

export const initPostEdit = createAction(types.EDIT_INIT, async (photos) => {
  return {}
})

export const insertMedias = createAction(types.EDIT_ADD_MEDIA, async (index, medias) => {
  return {index, medias}
})

export const mediaUp = createAction(types.EDIT_MEDIA_UP, async (index) => {
  return index
})

export const mediaDown = createAction(types.EDIT_MEDIA_DOWN, async (index) => {
  return index
})

export const deleteMedia = createAction(types.EDIT_MEDIA_DEL, async (index) => {
  return index
})

export const updateMediaByIndex = createAction(types.EDIT_MEDIA_UPDATE_BY_IDX,
  async (index, update) => {
    return {index, update}
  })

export const updateMediaByBody = createAction(types.EDIT_MEDIA_UPDATE_BY_BODY,
  async (body, update) => {
    return {body, update}
  })

export const setPostState = createAction(types.EDIT_UPDATE_STATE,
  async (params) => params)

export const clearEdit = createAction(types.EDIT_CLEAR)