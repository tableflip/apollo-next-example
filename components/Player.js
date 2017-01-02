import React from 'react'
import { Card, CardImage, Heading, Text } from 'rebass'
import Link from 'next/link'

export default class Player extends React.Component {
  state = {
    changingTeam: false
  }

  onChangingTeamToggle = () => {
    this.setState({ changingTeam: !this.state.changingTeam })
  }

  changeTeamFactory = (teamId) => () => {
    this.props.changeTeam(teamId)
      .then(() => this.setState({ changingTeam: false }))
  }

  renderChangeTeam = () => {
    return (
      <div className='absolute'>
        <div className='fixed top-0 bottom-0 left-0 right-0' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} onClick={this.onChangingTeamToggle} />
        <div className='relative z1 border rounded py1 px2' style={{ backgroundColor: 'white' }}>
          {this.props.teams.map(this.renderTeam)}
        </div>
      </div>
    )
  }

  renderTeam = (team) => {
    return <div key={team.id}><a href='#' onClick={this.changeTeamFactory(team.id)}>{team.name}</a></div>
  }

  render () {
    const player = this.props.player || {}

    return (
      <Card
        rounded
        width={256}
      >
        <CardImage src={player.avatar || 'http://placehold.it/256x256'} />
        <Heading
          level={2}
          size={3}
        >
          {player.firstName} {player.lastName}
        </Heading>
        <Text>
          <Link href={`/team?id=${player.team.id}`}>{player.team && player.team.name}</Link>
          <a href='#' onClick={this.onChangingTeamToggle}>Change Team</a>
          {this.state.changingTeam ? this.renderChangeTeam() : null}
        </Text>
      </Card>
    )
  }
}
