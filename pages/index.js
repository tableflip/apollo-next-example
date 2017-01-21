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

  renderTeam = (team, ind) => {
    const border = ind ? 'bl-0 br-0 bb-0 ba' : 'bn'
    return (
      <li key={team._id} className={`lh-copy pv4 ${border} b--dotted b--primary-l1 f3 ttu tracked-mega`}>
        <Link href={`/team?_id=${encodeURIComponent(team._id)}`}>
          <a className='link dim pointer no-underline dark-gray'>{team.name}</a>
        </Link>
      </li>
    )
  }

  render () {
    return (
      <div className='mt4 mb3'>
        <ul className='list pt4 mw7 center'>
          {this.props.teams.map(this.renderTeam)}
        </ul>
      </div>
    )
  }
}

export default wrapper(Index)
