'use strict'

import * as types from './actionTypes'
import {createAction} from 'redux-actions'

export function _findDraftById(userId, draftId) {
  let drafts = _findDrafts(userId)
  return drafts[draftId] || null
}

function _saveDraft(userId, draftId, data) {
  let drafts = _findDrafts(userId)
  if (!draftId) draftId = Date.now()
  drafts[draftId] = data
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
    data.unshift({
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