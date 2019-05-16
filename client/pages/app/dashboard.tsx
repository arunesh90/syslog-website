import { Component } from "react"
import { getSession } from "../../scripts/session"
import { NextContext } from "next"
import userSession from "../../../types/session"
import Link from 'next/link'
import { Button, Container, Title } from "bloomer"
import AppNavBar from "../../components/NavBar"
import { getApplications } from "../../scripts/application"
import applicationEntity from "../../../entities/application"

interface IndexProps {
  session     : userSession,
  applications: applicationEntity[]
}

import '../../styles/app.scss'

export default class IndexPage extends Component<IndexProps> {
  static async getInitialProps (ctx: NextContext) {
    const session      = await getSession(ctx)
    const applications = await getApplications(ctx)
    
    return {
      session,
      applications
    }
  }

  render () {
    const { applications } = this.props

    return (
      <AppNavBar session={this.props.session}>
        <Container isFluid style={{marginTop: 20}}>
          <Title className="main-title" isSize={3}>Applications</Title>

          <Container style={{border: '1px solid', borderRadius: 5, padding: 10}}>
            {applications.map(application => {
              return <Link key={application.id} passHref={true} as={`/app/application/${application.id}/logs`} href={`/app/logs?id=${application.id}`}><Button isLink={true}>{application.name}</Button></Link>
            })}
          </Container>
        </Container>
      </AppNavBar>
    )
  }
}
