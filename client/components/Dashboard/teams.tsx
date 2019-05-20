import { Component } from 'react'
import { Container, Button, Title } from 'bloomer'
import { TeamsConsumer } from '../../context/teams'
import Link from 'next/link'

export default class DashboardTeams extends Component {
  render () {
    return (
      <TeamsConsumer>
        { teams => teams && (
          <Container isFluid style={{ marginTop: 20, marginLeft: '3.5rem'}}>
            <Title className="main-title" isSize={3}>Teams</Title>
            <Container className="containerList" style={{ border: '1px solid', borderRadius: 5, padding: 10 }}>
              {teams.map((team) => (
                <Link key={team.id} passHref href={`/app/dashboard?item=teams?id=${team.id}`} as={`/app/dashboard/teams/${team.id}`}>
                  <Button isColor='info'>{team.name}</Button>
                </Link>
              ))}
            </Container>
          </Container>
        )}
      </TeamsConsumer>   
    )
  }
}
