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
                <Container className="containerList" style={{ border: '1px solid', borderRadius: 5, padding: 10 }}>
                  {applications.map((application) => (
                    <Link key={application.id} passHref href={`/app/logs?id=${application.id}`} as={`/app/application/${application.id}/logs`}>
                      <Button isColor='info'>{application.name}</Button>
                    </Link>
                  ))}
                </Container>
              </Container>
            )}
          </SessionConsumer>
        )}
      </ApplicationsConsumer>
    )
  }
}