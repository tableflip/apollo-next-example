import React from 'react'
import Link from 'next/link'
import gql from 'graphql-tag'
import wrapper from '../components/wrapper'

const gqlGetTeams = gql`
  query Teams {
    teams {
      _id
      name
    }
  }
`

class Index extends React.Component {
  static getInitialProps ({ client }) {
    return client.query({
      query: gqlGetTeams
    }).then((res) => ({ teams: res.data.teams }))
  }

  renderTeam = (team) => {
    return (
      <li key={team._id}>
        <Link href={`/team?_id=${encodeURIComponent(team._id)}`}>{team.name}</Link>
      </li>
    )
  }

  render () {
    return (
      <ul>
        {this.props.teams.map(this.renderTeam)}
      </ul>
    )
  }
}

export default wrapper(Index)
