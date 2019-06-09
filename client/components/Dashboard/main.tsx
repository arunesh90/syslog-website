import { Component, FormEvent } from 'react'
import { SessionConsumer } from '../../context/session'
import { ApplicationsConsumer } from '../../context/applications'
import Link from 'next/link'
import axios from 'axios'
import { 
  Button, Container, Title, Modal, ModalCard, ModalCardHeader, ModalCardTitle, 
  ModalCardBody, ModalCardFooter, ModalBackground, Input, Notification, Label, Control, 
  Select 
} from 'bloomer'
import { TeamsConsumer } from '../../context/teams';

export interface AddApplicationForm {
  name   : string,
  teamId?: string
}

interface DashboardMainState {
  createModalActive: boolean,
  formNotification?: JSX.Element
}

export default class DashboardMain extends Component<null, DashboardMainState> {
  constructor (props: any) {
    super(props)

    this.state = {
      createModalActive: false
    }

    this.toggleCreateModal = this.toggleCreateModal.bind(this)
    this.submitApplication = this.submitApplication.bind(this)
  }

  
  toggleCreateModal () {
    this.setState({
      createModalActive: !this.state.createModalActive
    })
  }

  async submitApplication (event: FormEvent<HTMLFormElement>) {
    // Prevent reload
    event.preventDefault()

    const formData        = new FormData(event.target as HTMLFormElement)
    const applicationName = formData.get('applicationName')
    const teamId          = formData.get('applicationTeamId')

    if (!applicationName) {
      const notification = <Notification isColor='danger'>Missing application name</Notification>
      this.setState({
        formNotification: notification
      })

      return
    }

    try {
      const { data } = await axios({
        method: 'POST',
        url: '/api/applications/create',
        data: {
          name: applicationName,
          teamId: teamId || undefined
        }
      })

      const formNotification = <Notification isColor='success'>
        Added! Your application key is <b>{data.key}</b>
      </Notification>

      this.setState({
        formNotification
      })
    } catch (error) {
      const notification = <Notification isColor='danger'>API returned a error..</Notification>
      this.setState({
        formNotification: notification
      })

      console.error(error, error.message)
    }

    // console.log(applicationName, teamId)
  }

  render() {
    return (
      <ApplicationsConsumer>
        { applications => (
          <SessionConsumer>
            { session =>  (
              <TeamsConsumer>
                { teams => (applications && session && teams) && (
                  <div>
                    <Modal isActive={this.state.createModalActive}>
                      <form id="submitAppForm" onSubmit={this.submitApplication}>
                        <ModalBackground onClick={this.toggleCreateModal} />
                        <ModalCard>
                          <ModalCardHeader>
                            <ModalCardTitle>Add Application</ModalCardTitle>
                            <button type='button' className='modal-close is-large' onClick={this.toggleCreateModal}></button>
                          </ModalCardHeader>
                          <ModalCardBody>
                            <div id="formNotification">
                              {this.state.formNotification}
                            </div>
                            <div className="field">
                              <Label>Application Name</Label>
                              <div className="control">
                                <Input name="applicationName" />
                              </div>
                            </div>

                            <div className="field">
                              <Label>Team (Optional)</Label>
                              <Control>
                                <Select defaultValue='none' name='teamId'>
                                  <option key='none' value='none'>None</option>
                                  { teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>) }
                                </Select>
                              </Control>
                            </div>
                          </ModalCardBody>
                          <ModalCardFooter>
                            <Button isColor='success' type='submit'>Add</Button>
                          </ModalCardFooter>
                        </ModalCard>
                      </form>
                    </Modal>


                    <Container isFluid style={{ marginTop: 20, marginLeft: '3.5rem' }}>
                      <div className="allInline pbottom10">
                        <Title className="main-title" isSize={3}>Applications</Title>
                        <Button onClick={this.toggleCreateModal} className="addButton" isColor='success'>Create</Button>
                      </div>
                      <Container isFluid className="containerList" style={{ border: '1px solid', borderRadius: 5, padding: 10 }}>
                        {applications.map((application) => (
                          <Link key={application.id} passHref href={`/app/logs?id=${application.id}`} as={`/app/application/${application.id}/logs`}>
                            <Button isColor='info'>{application.name}</Button>
                          </Link>
                        ))}
                      </Container>
                    </Container>
                  </div>
                )}
              </TeamsConsumer>
            )}
          </SessionConsumer>
        )}
      </ApplicationsConsumer>
    )
  }
}