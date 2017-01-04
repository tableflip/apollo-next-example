import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import wrapper from '../components/wrapper'
import Player from '../components/Player'

const gqlGetPlayer = gql`
  query Players($_id: String!) {
    players(_id: $_id) {
      _id
      firstName
      lastName
      avatar
      team {
        _id
        name
      }
    }
  }
`

const gqlGetTeams = gql`
  query Teams {
    teams {
      _id
      name
    }
  }
`

const gqlSetTeam = gql`
  mutation updatePlayer ($_id: String!, $team: String) {
    updatePlayer(_id: $_id, team: $team) {
      firstName
      lastName
      avatar
      team {
        _id
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
        variables: { _id: query._id || 1 }
      }).then((res) => res.data.players[0]),
      client.query({
        query: gqlGetTeams
      }).then((res) => res.data.teams)
    ]).then((arr) => ({ player: arr[0], teams: arr[1] }))
  }

  state = {
    player: this.props.player
  }

  changeTeam = (teamId) => {
    return this.props.client.mutate({
      mutation: gqlSetTeam,
      variables: {
        _id: this.props.player._id,
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
