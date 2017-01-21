import gql from 'graphql-tag'

const loginMutation = gql`
  mutation requestToken($username: String!, $password: String!) {
    requestToken(username: $username, password: $password)
  }
`

const dumpCollectionMutation = gql`
  mutation dumpCollection($collection: String!) {
    dumpCollection(collection: $collection)
  }
`

const getUserQuery = gql`
  query getUser {
    getUser {
      _id,
      username
    }
  }
`

export const LOGIN = 'LOGIN'
export function login ({ username, password }, client) {
  return {
    type: LOGIN,
    promise: client.mutate({
      mutation: loginMutation,
      variables: { username, password }
    }),
    meta: {
      onSuccess: ({ data: { requestToken } }) => {
        window.localStorage.setItem('jwt', requestToken)
      },
      onFailure: (err) => {
        console.error('Login error', err)
      }
    }
  }
}

export const LOGOUT = 'LOGOUT'
export function logout () {
  window.localStorage.removeItem('jwt')
  window.localStorage.removeItem('user')
  return {
    type: LOGOUT
  }
}

export const DUMP_COLLECTION = 'DUMP_COLLECTION'
export function dumpCollection (client, collection) {
  return {
    type: DUMP_COLLECTION,
    promise: client.mutate({
      mutation: dumpCollectionMutation,
      variables: {
        collection
      }
    })
  }
}

export const GET_USER = 'GET_USER'
export function getUser (client) {
  if (!window.localStorage.getItem('jwt')) return
  return {
    type: GET_USER,
    promise: client.query({
      query: getUserQuery
    }),
    meta: {
      onSuccess: (res) => {
        window.localStorage.setItem('user', JSON.stringify(res.data.getUser))
      },
      onFailure: (err) => {
        console.error('getUser error', err)
      }
    }
  }
}

export const SET_USER = 'SET_USER'
export function setUser (user) {
  return {
    type: SET_USER,
    user
  }
}

export const POP_MESSAGE = 'POP_MESSAGE'
export function popMessage (message) {
  return {
    type: POP_MESSAGE,
    message
  }
}
