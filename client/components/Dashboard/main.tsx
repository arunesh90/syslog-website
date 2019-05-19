import { SessionConsumer } from "../../context/session"
import { Component } from "react"
import Link from 'next/link'
import { Button, Container, Title } from "bloomer"
import { ApplicationsConsumer } from "../../context/applications"

export default class DashboardMain extends Component {
  render () {
    return (
      <ApplicationsConsumer>
        { applications => (
          <SessionConsumer>
            { session => session && applications && (
              <Container isFluid style={{ marginTop: 20, marginLeft: '3.5rem' }}>
                <Title className="main-title" isSize={3}>Applications</Title>
                <Container style={{ border: '1px solid', borderRadius: 5, padding: 10 }}>
                  {applications.map(application => {
                    return <Link key={application.id} passHref={true} as={`/app/application/${application.id}/logs`} href={`/app/logs?id=${application.id}`}><Button isLink={true}>{application.name}</Button></Link>
                  })}
                </Container>
              </Container>
            )}
          </SessionConsumer>
        )}
      </ApplicationsConsumer>
    )
  }
}