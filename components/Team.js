import React from 'react'
import { Card, Heading, Text } from 'rebass'
import Link from 'next/link'

export default class Team extends React.Component {
  render () {
    const team = this.props.team || {}

    return (
      <Card
        rounded
        width={256}
      >
        <Heading
          level={2}
          size={3}
        >
          {team.name}
        </Heading>
        <Text>
          {team.players ? team.players.map((player) => {
            return (
              <div key={player.id} className='mb2'>
                <Link href={`/player?id=${player.id}`}><span>{player.firstName} {player.lastName}</span></Link>
              </div>
            )
          }) : null}
        </Text>
      </Card>
    )
  }
}
