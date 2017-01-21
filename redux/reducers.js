import { handle } from 'redux-pack'
import { LOGIN, LOGOUT, GET_USER, SET_USER, DUMP_COLLECTION, POP_MESSAGE } from './actions'

export function message (state = null, action) {
  const { type, payload, message } = action

  switch (type) {
    case LOGIN:
      return handle(state, action, {
        failure: () => ({
          type: 'error',
          title: 'Login error',
          text: payload.message
        })
      })

    case GET_USER:
      return handle(state, action, {
        failure: () => ({
          type: 'error',
          title: 'User error',
          text: payload.message
        })
      })

    case DUMP_COLLECTION:
      return handle(state, action, {
        success: () => ({
          type: 'success',
          title: 'Collection dumped',
          text: 'Collection has been dumped'
        }),
        failure: () => ({
          type: 'error',
          title: 'Collection dump failure',
          text: 'Could not dump collection'
        })
      })

    case POP_MESSAGE:
      return message

    default:
      return state
  }
}

export function jwt (state = null, action) {
  const { type, payload } = action

  switch (type) {
    case LOGIN:
      return handle(state, action, {
        success: () => payload.data.requestToken
      })

    default:
      return state
  }
}

export function user (state = null, action) {
  const { type, payload } = action

  switch (type) {
    case GET_USER:
      return handle(state, action, {
        success: () => payload.data.getUser
      })

    case SET_USER:
      return action.user

    case LOGOUT:
      return null

    default:
      return state
  }
}
