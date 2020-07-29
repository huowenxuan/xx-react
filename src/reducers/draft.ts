import {handleActions} from 'redux-actions';
import * as types from '../actions/actionTypes'

let defaultState = {
  drafts: []
}

export default handleActions({
  [types.SYNC_DRAFTS]: ({
    next(state, {payload}) {
      return {
        ...state,
        drafts: payload
      }
    }
  }),
}, defaultState)