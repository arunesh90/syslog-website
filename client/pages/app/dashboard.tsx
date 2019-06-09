import { Component, RefObject, createRef } from 'react'
import Router, { withRouter, SingletonRouter } from 'next/router'
import userSession from '../../../types/session'
import applicationEntity from '../../../entities/application'
import applicationTeam from '../../../entities/applicationTeam'
import { NextContext } from 'next'
import { getSession } from '../../scripts/session'
import { getApplications } from '../../scripts/application'
import { getTeams } from '../../scripts/teams'
import { SessionProvider } from '../../context/session'
import { ApplicationsProvider } from '../../context/applications'
import { TeamsProvider } from '../../context/teams'
import { RotateLoader } from 'react-spinners'
import { recentLoaderOverride as loaderOverride } from '../../styles/messageLoader'
import AppNavBar from '../../components/NavBar'
import { Helmet} from 'react-helmet'
import dynamicLoad from 'next/dynamic'

interface DashboardProps {
  session     : userSession,
  applications: applicationEntity[],
  teams       : applicationTeam[],
  router      : SingletonRouter
}

interface DashboardState {
  activeItem   : string
  activeSubItem: string | null
}

import '../../styles/utilities.scss'
import '../../styles/sidebar.scss'
import '../../styles/app.scss'

class DashboardPage extends Component<DashboardProps, DashboardState> {
  constructor (props: DashboardProps) {
    super(props)

    const router: SingletonRouter = this.props.router!
    let   activeItem              = 'main'
    let   activeSubItem           = null

    if (router.query) {
      activeItem    = router.query['item']    as string || activeItem
      activeSubItem = router.query['subItem'] as string || activeSubItem
    }

    this.state  = {
      activeItem,
      activeSubItem
    }
  }

  static async getInitialProps (ctx: NextContext) {
    const session      = await getSession(ctx)
    const applications = await getApplications(ctx)
    const teams        = await getTeams(ctx)
    
    return {
      session,
      applications,
      teams
    }
  }

  componentDidMount () {
    const activeElement = document.getElementById(`sidebar-${this.state.activeItem}`)

    if (activeElement) {
      activeElement.classList.add('sidebar-active')
    }
  }

  componentDidUpdate () {
    this.refreshPage()
  }

  refreshPage () {
    const router: SingletonRouter = this.props.router!
    const newItem                 = router.query['item']    as string
    const newSubItem              = router.query['subItem'] as string

    if (this.state.activeItem !== newItem || this.state.activeSubItem !== newSubItem) {
      console.log('item changed to', newItem)
      this.setState({
        activeItem   : newItem,
        activeSubItem: newSubItem
      })
    }
  }

  changeItem (newItem: string, subItem?: string, asUrl?: string) {
    const router: SingletonRouter = this.props.router
    const oldElement              = document.getElementById(`sidebar-${this.state.activeItem}`)
    const newElement              = document.getElementById(`sidebar-${newItem}`)

    if (oldElement) {
      oldElement.classList.remove('sidebar-active')
    } if (newElement) {
      newElement.classList.add('sidebar-active')
    }

    console.log('item changed to', newItem)
    this.setState({
      activeItem   : newItem,
      activeSubItem: subItem
    })

    // Push history change
    console.log({
      pathname: router.pathname,
      query   : {
        item   : newItem,
        subItem
      }
    })
    let shownURL: string
    if (asUrl) {
      shownURL = asUrl  
    } else if (subItem) {
      shownURL = `${router.pathname}/${newItem}/${subItem}`
    } else {
      shownURL = `${router.pathname}/${newItem}`
    }

    Router.push({
      pathname: router.pathname,
      query   : {
        item   : newItem,
        subItem
      }
    }, {
      pathname: shownURL
    }, { shallow: true })
  }


  render () {
    const { applications, session, teams, router } = this.props
    const { activeItem, activeSubItem }            = this.state

    // Load active item
    let activeComponent = activeItem
    if (activeSubItem) {
      activeComponent += `/${activeSubItem}`
    }
    console.log(activeComponent, router.query)
    const ActiveItem = dynamicLoad(
      () => import(`../../components/Dashboard/${activeComponent}`)
      .catch((err: {
        code: string, 
        stack: string
      }) => {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.error(`Module ${activeComponent} not found`)
          this.changeItem('main', null, '/app/dashboard')
          return
        }
        console.error(err)
      }), {
        loading: () => <RotateLoader css={loaderOverride} color={'#4e6277'} loading={true} />,
        ssr    : false
      },
    )

    return (
      <SessionProvider value={session}>
        <ApplicationsProvider value={applications}>
          <TeamsProvider value={teams}>
            <Helmet>
              <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/solid.js" />
              <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/fontawesome.js" />
            </Helmet>
            <AppNavBar session={session}>
              <aside className="sidebar">
                <div onClick={() => this.changeItem('main', null, '/app/dashboard')} id="sidebar-main" className="sidebar-item" title="Main">
                  <div className="sidebar-icon">
                    <i className="fas fa-home" />
                  </div>
                </div>
                <hr/>
                <div onClick={() => this.changeItem('applications')} id="sidebar-applications" className="sidebar-item" title="Applications">
                  <div className="sidebar-icon">
                    <i className="fas fa-list" />
                  </div>
                </div>
                <hr/>
                <div onClick={() => this.changeItem('teams')} className="sidebar-item" id="sidebar-teams" title="Teams">
                  <div className="sidebar-icon">
                    <i className="fas fa-users" />
                  </div>
                </div>
              </aside>

              <div style={{marginLeft: '2.5rem'}}>
                
                <ActiveItem />
              </div>
            </AppNavBar>
          </TeamsProvider>
        </ApplicationsProvider>
      </SessionProvider>
    )
  }
}

export default withRouter(DashboardPage)