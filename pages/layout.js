import React from 'react'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'
import { login, logout, getUser, dumpCollection, popMessage } from '../redux/actions'

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

  onLogin = (evt) => {
    evt.preventDefault()
    this.props.login(this.state, this.props.client)
      .then(() => this.props.getUser(this.props.client))
      .catch((err) => this.popMessage({ type: 'error', title: 'Login error', text: err.message }))
  }

  onLogout = (evt) => {
    evt.preventDefault()
    this.props.logout()
  }

  dumpPlayers = () => {
    this.props.dumpCollection(this.props.client, 'players')
  }

  dumpTeams = () => {
    this.props.dumpCollection(this.props.client, 'teams')
  }


  renderLogin = () => {
    return (
      <form onSubmit={this.onLogin} className='pa4'>
        <div className='measure dib v-btm'>
          <label htmlFor='username' className='f6 b db mb2'>Username</label>
          <input type='text' name='username' placeholder='gary123' className='input-reset ba b--black-20 bg-white pa2 db w-100' onChange={this.onChangeFactory('username')} value={this.state.username} style={{ marginBottom: '-1px' }} />
        </div>
        <div className='measure dib ml1 v-btm'>
          <label htmlFor='password' className='f6 b db mb2'>Password</label>
          <input type='password' name='password' placeholder='gary123' className='input-reset ba b--black-20 bg-white pa2 db w-100' onChange={this.onChangeFactory('password')} value={this.state.password} style={{ marginBottom: '-1px' }} />
        </div>
        <button type='submit' className='f6 link dim br1 bn ph3 pv2 ml2 dib dark-gray bg-primary button-reset v-btm'>Login</button>
      </form>
    )
  }

  renderLogout = () => {
    return (
      <div className='pa4'>
        <a href='#' className='f6 link dim moon-gray v-mid' onClick={this.onLogout}>Logout</a>
        <div className='dib ml4 f3 fw6 v-mid primary'>{this.props.user.username}</div>
      </div>
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
        <div className='moon-gray bg-dark-gray flex flex-row justify-between items-end b--primary-d1 bb bw1'>
          {this.props.user ? this.renderLogout() : this.renderLogin()}
          <div className='pa4'>
            <button className='f6 link dim br3 ph3 pv2 ml2 dib bg-transparent primary-l1 bw2 ba b--primary button-reset pointer' onClick={this.dumpPlayers}>Dump players</button>
            <button className='f6 link dim br3 ph3 pv2 ml2 dib bg-transparent primary-l1 bw2 ba b--primary button-reset pointer' onClick={this.dumpTeams}>Dump teams</button>
            <Link href='/'><a className='link dim moon-gray ml5'>Home</a></Link>
          </div>
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
const mapDispatchToProps = { login, logout, getUser, dumpCollection, popMessage }

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(Layout))
