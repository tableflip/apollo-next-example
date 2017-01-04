import React from 'react'
import Link from 'next/link'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import wrapper from '../components/wrapper'
import Team from '../components/Team'

const gqlQuery = gql`
  query Teams($_id: String!) {
    teams(_id: $_id) {
      name
      players {
        _id
        firstName
        lastName
      }
    }
  }
`

class TeamPage extends React.Component {
  static getInitialProps ({ query, client }) {
    return client.query({
      query: gqlQuery,
      variables: { _id: String(query._id) || '1' }
    })
  }

  render () {
    const team = this.props.data && this.props.data.teams[0]
    return (
      <div>
        <Team team={team} />
        <Link href='/'><a>Home</a></Link>
      </div>
    )
  }
}

export default wrapper(TeamPage)
