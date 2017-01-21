import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
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

const playerUpdatedSub = gql`
  subscription playerUpdated($_id: String!) {
    playerUpdated(_id: $_id) {
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

class PlayerPage extends React.Component {
  static getInitialProps ({ query, client }) {
    return Promise.all([
      client.query({
        query: gqlGetPlayer,
        variables: { _id: query._id }
      }).then((res) => res.data.players[0]),
      client.query({
        query: gqlGetTeams
      }).then((res) => res.data.teams)
    ]).then((arr) => ({ player: arr[0], teams: arr[1] }))
  }

  state = {
    player: this.props.player
  }

  componentDidMount () {
    const { query } = this.props.url
    this.props.data.subscribeToMore({
      document: playerUpdatedSub,
      variables: { _id: query._id },
      updateQuery: (previousResult, { subscriptionData: { data: { playerUpdated } } }) => {
        console.log(playerUpdated)
        this.setState({ player: playerUpdated })
        return Object.assign({}, previousResult, { players: [playerUpdated] })
      },
      onError: (err) => console.error('Subscription error', err)
    })
  }

  changeTeam = (teamId) => {
    return this.props.mutate({
      variables: {
        _id: this.props.player._id,
        team: teamId
      }
    })
  }

  render () {
    return (
      <div className='flex flex-column items-stretch justify-center pv5'>
        <Player player={this.state.player} teams={this.props.teams} changeTeam={this.changeTeam} />
        <div className='bottom-0 bb b--primary-l2 b--dotted bw2 w5 self-center' style={{ maxWidth: '70%' }}></div>
      </div>
    )
  }
}

export default wrapper(PlayerPage, compose(
  graphql(gqlGetPlayer, {
    options: ({ url: { query: { _id } } }) => ({ variables: { _id } })
  }),
  graphql(gqlSetTeam)
))
