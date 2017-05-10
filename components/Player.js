import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { popMessage } from '../redux/actions'

class Player extends React.Component {
  state = {
    changingTeam: false
  }

  onChangingTeamToggle = () => {
    this.setState({ changingTeam: !this.state.changingTeam })
  }

  changeTeamFactory = (teamId) => () => {
    this.props.changeTeam(teamId)
      .then(() => this.setState({ changingTeam: false }))
      .catch((err) => { console.log(err); this.props.popMessage({ type: 'error', text: err.message }) })
  }

  renderChangeTeam = () => {
    return (
      <div className='absolute right-0 top-2'>
        <div className='fixed top-0 bottom-0 left-0 right-0' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} onClick={this.onChangingTeamToggle} />
        <div className='relative z1 border rounded pv2 ph3 bg-white shadow-1 ba b--silver br1 lh-copy'>
          {this.props.teams.map(this.renderTeam)}
        </div>
      </div>
    )
  }

  renderTeam = (team) => {
    return <div key={team._id}><a className='link dim pointer dark-gray' href='#' onClick={this.changeTeamFactory(team._id)}>{team.name}</a></div>
  }

  render () {
    const player = this.props.player || {}

    return (
      <div className='db flex flew-row flex-auto items-center mb5'>
        <div className='mr5' style={{ flex: '1 1 0' }}>
          <div className='tr '>
            <h1 className='dib dark-gray bg-light-gray pb2 pt3 ph3 ma0'>{player.firstName}</h1>
          </div>
          <div className='tr mt1'>
            <h1 className='f2 dib accent bg-light-gray pb2 pt3 ph3 ma0'>{player.lastName}</h1>
          </div>
          <dl className='tr lh-leading mt4'>
            <dt className='clip'>Team</dt>
            <dd><Link href={`/team?_id=${player.team._id}`}>
              <a className='ml0 f4 fw3 ttu tracked no-underline primary-d2 dim link'>{player.team && player.team.name || 'None'}</a>
            </Link></dd>
            <dd className='tr relative'>
              <a href='#' className='no-underline f5 fw8 light-silver dim tr link' onClick={this.onChangingTeamToggle}>Change Team</a>
              {this.state.changingTeam ? this.renderChangeTeam() : null}
            </dd>
          </dl>
        </div>

        <div className='tl' style={{ flex: '1 1 0' }}>
          <img className='w5 h5 dib'
            alt={`${player.firstName} ${player.lastName}`}
            src={player.avatar || 'http://placehold.it/256x256'} />
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = { popMessage }

export default connect(null, mapDispatchToProps)(Player)
