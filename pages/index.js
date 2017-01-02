import React from 'react'
import Link from 'next/link'
import wrapper from '../components/wrapper'

class Index extends React.Component {
  render () {
    return (
      <div>
        <Link href='/player?id=1'><a>Player</a></Link>
        <Link href='/team?id=1'><a>Team</a></Link>
      </div>
    )
  }
}

export default wrapper(Index)
