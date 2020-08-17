'use strict'

import * as types from './actionTypes'
import {createAction} from 'redux-actions'

export function _findDraftById(userId, draftId) {
  let drafts = _findDrafts(userId)
  return drafts[draftId] || null
}

/**
 * 保存草稿
 * @param userId
 * @param draftId 如果编辑帖子，draftId为帖子id，如果直接新建，draftId为时间
 * @param data
 * @private
 */
function _saveDraft(userId, draftId, data) {
  let drafts = _findDrafts(userId)
  let now = Date.now()
  data.draft_updated_at = now
  if (!draftId) draftId = now
  data.draftId = draftId
  if (!drafts[draftId]) {
    data.draft_created_at = now
    drafts = {
      [draftId]: data,
      ...drafts,
    }
  } else {
    drafts[draftId] = data
  }
  localStorage.setItem(`draft-${userId}`, JSON.stringify(drafts))
}

function _deleteDraft(userId, draftId) {
  let drafts = _findDrafts(userId)
  delete drafts[draftId]
  localStorage.setItem(`draft-${userId}`, JSON.stringify(drafts))
}

function _deleteAllDrafts(userId) {
  localStorage.removeItem(`draft-${userId}`)
}

function _findDrafts(userId) {
  let data = localStorage.getItem(`draft-${userId}`)
  if (!data) return {}
  return JSON.parse(data)
}

function _format(drafts) {
  let data = []
  for (let k in drafts) {
    data.push({
      draftId: k,
      ...drafts[k]
    })
  }
  return data
}

export const findDrafts = createAction(types.SYNC_DRAFTS, async (userId) => {
  return _format(_findDrafts(userId))
})

export const deleteDraft = createAction(types.SYNC_DRAFTS, async (userId, draftId) => {
  _deleteDraft(userId, draftId)
  return _format(_findDrafts(userId))
})

export const saveDraft = createAction(types.SYNC_DRAFTS, async (userId, draftId, data) => {
  _saveDraft(userId, draftId, data)
  return _format(_findDrafts(userId))
})

export const deleteAllDrafts = createAction(types.SYNC_DRAFTS, async (userId, draftId) => {
  _deleteAllDrafts(userId)
  return _format(_findDrafts(userId))
})

export const findDraftById = createAction('', async (userId, draftId) => {
  return _findDraftById(userId, draftId)
})

