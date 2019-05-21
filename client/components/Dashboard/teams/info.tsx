import { Component } from 'react'
import { TeamsConsumer } from '../../../context/teams'
import { SessionConsumer } from '../../../context/session';

export default class DashboardTeamsInfo extends Component {
  render () {
    return (
      <TeamsConsumer>
        {teams => (
          <SessionConsumer>
            {session => teams && session && (
              <div>
                <h1>Team info</h1>
              </div>
            )}
          </SessionConsumer>
        )}
      </TeamsConsumer>
    )
  }
}
