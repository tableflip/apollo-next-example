import React from 'react'
import Link from 'next/link'

export default class Team extends React.Component {
  render () {
    const team = this.props.team || {}

    return (
      <article className='mw8 center'>
        <h1 className='f1 fw4 mv0 tracked-tight dib accent bg-light-gray pb2 pt3 ph3 mh3'>{team.name}</h1>
        <div className='cf pa2'>
          {team.players ? team.players.map((player) => (
            <div className='fl w-50 w-25-m w-20-l pa2' key={player._id}>
              <Link href={`/player?_id=${encodeURIComponent(player._id)}`}>
                <a className='link'>
                  <div className='db link dim tc'>
                    <img src={player.avatar} alt={`${player.firstName} ${player.lastName}`} className='w-100 mh db outline black-10' />
                    <dl className='mt2 f6 lh-copy'>
                      <dt className='clip'>Last name</dt>
                      <dd className='ml0 black-80 truncate w-100 ttu no-underline'>{player.lastName}</dd>
                      <dt className='clip'>First name</dt>
                      <dd className='ml0 gray truncate w-100 no-underline'>{player.firstName}</dd>
                    </dl>
                  </div>
                </a>
              </Link>
            </div>
          )) : null}
        </div>
      </article>
    )
  }
}
