import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import wrapper from '../components/wrapper'
import Player from '../components/Player'

const gqlGetPlayer = gql`
  query Players($id: Int!) {
    players(id: $id) {
      id
      firstName
      lastName
      avatar
      team {
        id
        name
      }
    }
  }
`

const gqlGetTeams = gql`
  query Teams {
    teams {
      id
      name
    }
  }
`

const gqlSetTeam = gql`
  mutation updatePlayer ($id: Int!, $team: Int) {
    updatePlayer(id: $id, team: $team) {
      firstName
      lastName
      avatar
      team {
        id
        name
      }
    }
  }
`

class PlayerPage extends React.Component {
  static getInitialProps ({ query, client }) {
    return Promise.all([
      client.query({
        query: gqlGetPlayer,
        variables: { id: query.id || 1 }
      }).then((res) => res.data.players[0]),
      client.query({
        query: gqlGetTeams
      }).then((res) => res.data.teams)
    ]).then((res) => ({ player: res[0], teams: res[1] }))
  }

  state = {
    player: this.props.player
  }

  changeTeam = (teamId) => {
    return this.props.client.mutate({
      mutation: gqlSetTeam,
      variables: {
        id: this.props.player.id,
        team: teamId
      }
    })
      .then((res) => this.setState({ player: res.data.updatePlayer }))
  }

  render () {
    return (
      <div>
        <Player player={this.state.player} teams={this.props.teams} changeTeam={this.changeTeam} />
        <Link href='/'><a>Home</a></Link>
      </div>
    )
  }
}


const mapStateToProps = ({ client }) => ({ client })

export default wrapper(connect(mapStateToProps)(PlayerPage))
