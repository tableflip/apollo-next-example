import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import 'isomorphic-fetch'
import wrapper from '../components/wrapper'
import Team from '../components/Team'

const gqlGetTeam = gql`
  query Teams($_id: String!) {
    teams(_id: $_id) {
      name
      players {
        _id
        firstName
        lastName
        avatar
      }
    }
  }
`

const teamUpdatedSub = gql`
  subscription teamUpdated($_id: String!) {
    teamUpdated(_id: $_id) {
      name
      players {
        _id
        firstName
        lastName
        avatar
      }
    }
  }
`

class TeamPage extends React.Component {
  static getInitialProps ({ query, client }) {
    return client.query({
      query: gqlGetTeam,
      variables: { _id: String(query._id) }
    }).then((res) => ({ team: res.data.teams[0] }))
  }

  state = { team: this.props.team }

  componentDidMount () {
    const { query } = this.props.url
    this.props.data.subscribeToMore({
      document: teamUpdatedSub,
      variables: { _id: query._id },
      updateQuery: (previousResult, { subscriptionData: { data: { teamUpdated } } }) => {
        this.setState({ team: teamUpdated })
        return Object.assign({}, previousResult, { teams: [teamUpdated] })
      },
      onError: (err) => console.error('Subscription error', err)
    })
  }

  render () {
    const { team } = this.state
    return (
      <div className='flex flex-column items-center mt4 mb3'>
        <Team team={team} />
        <div className='bottom-0 bb b--primary-l2 b--dotted bw2 w5' style={{ maxWidth: '70%' }}></div>
      </div>
    )
  }
}

export default wrapper(TeamPage, graphql(gqlGetTeam, {
  options: ({ url: { query: { _id } } }) => ({ variables: { _id } })
}))
