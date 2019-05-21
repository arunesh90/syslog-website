import { SessionConsumer } from "../../context/session"
import { Component } from "react"
import Link from 'next/link'
import { Button, Container, Title, Modal, ModalCard, ModalCardHeader, ModalCardTitle, ModalCardBody, ModalCardFooter, ModalBackground, Input } from "bloomer"
import { ApplicationsConsumer } from "../../context/applications"
import { Form, Field } from 'react-final-form'
import TextInput from '../FormInput'
import { addApplication } from '../../scripts/application';

export interface AddApplicationForm {
  name   : string,
  teamId?: string
}

interface DashboardMainState {
  createModalActive: boolean
}

export default class DashboardMain extends Component<null, DashboardMainState> {
  constructor (props: any) {
    super(props)

    this.state = {
      createModalActive: false
    }

    this.toggleCreateModal = this.toggleCreateModal.bind(this)
  }

  toggleCreateModal () {
    this.setState({
      createModalActive: !this.state.createModalActive
    })
  }

  async addApplication (values: AddApplicationForm) {
    const newApp        = await addApplication(values)
    console.log(newApp)

    setTimeout(() => {
      location.reload()
    }, 2000)
  }

  render () {
    return (
      <ApplicationsConsumer>
        { applications => (
          <SessionConsumer>
            { session => session && applications && (
              <div>
                <Modal isActive={this.state.createModalActive}>
                  <ModalBackground />
                  <ModalCard>
                    <ModalCardHeader>
                      <ModalCardTitle>Add Application</ModalCardTitle>
                    </ModalCardHeader>
                      <Form
                        onSubmit = {(values: any) => { this.addApplication(values) }}
                        render   = {({ handleSubmit, pristine, invalid }) => (
                          <form onSubmit={handleSubmit}>
                            <ModalCardBody>
                              {/* <div id="submitStatus" className="notification"></div> */}
                              <div className="field">
                                <label className="label">Application Name</label>
                                <div className="control">
                                  <Field
                                    name        = "name"
                                    type        = "text"
                                    placeholder = "Application Name"
                                    component   = { TextInput }
                                  />
                                </div>
                              </div>

                              <div className="field">
                                <label className="label">Team ID (Optional)</label>
                                <div className="control">
                                  <Field
                                    name      = "teamId"
                                    type      = "number"
                                    component = { TextInput }
                                  />
                                </div>
                              </div>
                            </ModalCardBody>
                            <ModalCardFooter>
                              <Button isColor='success' type='submit' disabled={pristine || invalid}>Add</Button>
                              <Button isColor='danger' onClick={this.toggleCreateModal}>Cancel</Button>
                            </ModalCardFooter>
                          </form>
                        )} 
                      />
                  </ModalCard>
                </Modal>

                <Container isFluid style={{ marginTop: 20, marginLeft: '3.5rem' }}>
                  <div className="allInline 10pbottom">
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
          </SessionConsumer>
        )}
      </ApplicationsConsumer>
    )
  }
}