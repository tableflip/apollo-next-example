import React from 'react'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import Head from 'next/head'
import { login, logout, getUser } from '../redux/actions'

const ReactToastr = require('react-toastr')
const { ToastContainer } = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }

  state = {
    username: '',
    password: ''
  }

  componentWillReceiveProps ({ message }) {
    if (message && message !== this.props.message) {
      const messageFunc = (this.refs.container[message.type] || this.refs.container.success).bind(this.refs.container)
      messageFunc(
        message.text,
        message.title
      )
    }
  }

  onChangeFactory = (field) => (evt) => this.setState({ [field]: evt.currentTarget.value })

  onSubmit = (evt) => {
    evt.preventDefault()
    this.props.login(this.state, this.props.client)
      .then(() => this.props.getUser(this.props.client))
  }

  renderLogin = () => {
    return (
      <form onSubmit={this.onSubmit} className='flex flex-row flex-items-center flex-justify-start flex-auto'>
        <input type='text' name='username' placeholder='gary123' onChange={this.onChangeFactory('username')} value={this.state.username} />
        <input type='password' name='password' placeholder='mYpA$$w0rD' onChange={this.onChangeFactory('password')} value={this.state.password} />
        <input type='submit' value='Login' />
      </form>
    )
  }

  renderLogout = () => {
    return (
      <form onSubmit={this.props.logout} className='flex flex-row flex-items-center flex-justify-start flex-auto'>
        <input type='submit' value='Logout' />
      </form>
    )
  }

  render () {
    return (
      <div>
        <Head>
          <link rel='stylesheet' type='text/css' href='/static/animate.css/animate.min.css' />
          <link rel='stylesheet' type='text/css' href='/static/toastr/toastr.min.css' />
        </Head>
        <ToastContainer ref='container'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-right' />
        <div className='border p1'>
          {this.props.user ? this.renderLogout() : this.renderLogin()}
          <div>Username: {this.props.user && this.props.user.username}</div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { user, message } = state
  return { user, message }
}
const mapDispatchToProps = { login, logout, getUser }

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(Layout))
