'use strict'

import * as types from './actionTypes'
import {createAction} from 'redux-actions'
import * as request from '../request'
import * as utils from '../utils'

import {_findDraftById} from './draft'

const {API} = request

export const initPostEditWithPostId = createAction(types.EDIT_INIT, async (postId, token) => {
  let data = await request.get(API.postEdit + postId, {}, token)
  let {post}  = data
  console.log('编辑', post)
  const {media} = post
  for (let item of media) {
    const {info, type, style} = item
    if (type === 'image') {
      item.info = utils.toJson(info)
      item.style = utils.toJson(style)
    }
  }
  return post
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