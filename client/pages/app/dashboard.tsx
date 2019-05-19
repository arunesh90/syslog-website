import { Component } from "react"
import { getSession } from "../../scripts/session"
import { NextContext } from "next"
import userSession from "../../../types/session"
import AppNavBar from "../../components/NavBar"
import { getApplications } from "../../scripts/application"
import applicationEntity from "../../../entities/application"
import { SessionProvider } from "../../context/session"
import { ApplicationsProvider } from "../../context/applications"
import dynamicLoad from 'next/dynamic'
import { Helmet } from "react-helmet"
import { RotateLoader } from "react-spinners"
import { recentLoaderOverride as loaderOverride } from "../../styles/messageLoader"
import Router, { withRouter, SingletonRouter } from "next/router"

interface DashboardProps {
  session     : userSession,
  applications: applicationEntity[],
  router      : SingletonRouter
}

interface DashboardState {
  activeItem: string
}

import '../../styles/sidebar.scss'
import '../../styles/app.scss'

class DashboardPage extends Component<DashboardProps, DashboardState> {
  constructor (props: DashboardProps) {
    console.log('test')
    super(props)

    const router: SingletonRouter = this.props.router!
    let   activeItem              = 'main'

    if (router.query) {
      activeItem = router.query['item'] as string || 'main'
    }

    this.state = {
      activeItem
    }
  }

  static async getInitialProps (ctx: NextContext) {
    const session      = await getSession(ctx)
    const applications = await getApplications(ctx)
    
    return {
      session,
      applications
    }
  }

  componentDidMount () {
    const activeElement = document.getElementById(`sidebar-${this.state.activeItem}`)!
    activeElement.classList.add('sidebar-active')
  }

  componentDidUpdate () {
    this.refreshPage()
  }

  refreshPage () {
    const router: SingletonRouter = this.props.router!
    const newItem                 = router.query!['item'] as string

    if (this.state.activeItem !== newItem) {
      console.log('item changed to', newItem)
      this.setState({
        activeItem: newItem
      })
    }
  }

  changeItem (newItem: string) {
    const router: SingletonRouter = this.props.router
    const oldElement              = document.getElementById(`sidebar-${this.state.activeItem}`)!
    const newElement              = document.getElementById(`sidebar-${newItem}`)!

    oldElement.classList.remove('sidebar-active')
    newElement.classList.add('sidebar-active')

    this.setState({
      activeItem: newItem
    })

    // Push history change
    Router.push({
      pathname: router.pathname,
      query: {
        item: newItem
      }
    }, {
      pathname: `${router.pathname}/${newItem}`
    }, { shallow: true })
  }

  render () {
    const { applications, session } = this.props
    const ActiveItem                = dynamicLoad(
      () => import(`../../components/Dashboard/${this.state.activeItem}`), {
        loading: () => <RotateLoader css={loaderOverride} color={'#4e6277'} loading={true}/>
      }
    )

    return (
      <SessionProvider value={session}>
        <Helmet>
          <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/solid.js" />
          <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/fontawesome.js" />
        </Helmet>
        <ApplicationsProvider value={applications}>
          <AppNavBar session={session}>
            <aside className="sidebar">
              <div onClick={() => this.changeItem('main')} id="sidebar-main" className="sidebar-item" title="Main">
                <div className="sidebar-icon">
                  <i className="fas fa-home"/>
                </div>
              </div>
              <hr/>
              <div onClick={() => this.changeItem('applications')} id="sidebar-applications" className="sidebar-item" title="Applications">
                <div className="sidebar-icon">
                  <i className="fas fa-list"/>
                </div>
              </div>
              <hr/>
              <div onClick={() => this.changeItem('teams')} className="sidebar-item" id="sidebar-teams" title="Teams">
                <div className="sidebar-icon">
                  <i className="fas fa-users"/>
                </div>
              </div>
            </aside>

            <div style={{marginLeft: '2.5rem'}}>
              <ActiveItem/>
            </div>
          </AppNavBar>
        </ApplicationsProvider>
      </SessionProvider>
    )
  }
}

export default withRouter(DashboardPage)
