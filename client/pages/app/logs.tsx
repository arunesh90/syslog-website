import { Component, createRef, RefObject } from "react"
import AppNavBar from "../../components/NavBar"
import { NextContext } from "next"
import Router from 'next/router'
import { getSession } from "../../scripts/session"
import userSession from "../../../types/session"
import { getApplication, getRecentLogs, historyLogs, searchLogs } from "../../scripts/application"
import applicationEntity from "../../../entities/application"
import { hostname } from "../../../utils/constants"
import LogMessage from "../../components/LogMessage"
import ScrollArea from 'react-custom-scrollbars'
import { RotateLoader, BeatLoader } from 'react-spinners'
import RecentBar from "../../components/RecentBar"
import { syslogMessage } from "../../../types/syslog"
import { recentLoaderOverride, olderLoaderOverride } from "../../styles/messageLoader"
import SearchBar from "../../components/SearchBar"
import { Helmet } from "react-helmet"

interface LogsProps {
  session    : userSession,
  application: applicationEntity
}

interface LogsState {
  eventMessages   : JSX.Element[],
  tail            : boolean,
  mainLoading     : boolean,
  receivedFirst   : boolean,
  loadingOlder    : boolean,
  oldestMessageId?: number,
  currentSearch?  : string
}

import '../../styles/app.scss'

const eventsLimit = 500

export default class LogsPage extends Component<LogsProps, LogsState> {
  socket         : WebSocket
  scrollBar      : RefObject<ScrollArea>
  searchBarTimer?: NodeJS.Timeout

  constructor (props: LogsProps) {
    super(props)

    this.scrollBar = createRef()
    this.state = {
      eventMessages: [],
      tail         : true,
      mainLoading  : true,
      receivedFirst: false,
      loadingOlder : false
    }

    this.onScroll = this.onScroll.bind(this)
  }

  static async getInitialProps (ctx: NextContext) {
    const session     = await getSession(ctx)
    const application = await getApplication(ctx, ctx.query.id as string)

    if (!application.id) {
      if (ctx.res) {
        ctx.res.writeHead(302, {
          Location: '/app/dashboard'
        })
        return ctx.res.end()
      } else {
        return Router.push('/app/dashboard')
      }
    }
  
    return {
      session,
      application
    }
  }

  async onScroll () {
    const { tail, oldestMessageId, eventMessages, currentSearch } = this.state
    const { application }                                         = this.props
    const scrollbar                                               = this.scrollBar.current!
    
    const clientHeight = scrollbar.getClientHeight()
    const scrollHeight = scrollbar.getScrollHeight()
    const scrollTop    = scrollbar.getScrollTop()

    if (tail) {
      if (scrollHeight - scrollTop !== clientHeight) {
        console.log('tail off')
        this.setState({tail: false})
      }
    } else {
      if (scrollHeight - scrollTop === clientHeight) {
        console.log('tail on')
        this.setState({tail: true})
      }
    }

    // Check if top reached, if so fetch older logs
    if (scrollTop === 0 && !this.state.loadingOlder && eventMessages[0]) {
      const oldestMessage: syslogMessage = this.state.eventMessages[0].props.syslogMessage
      if (oldestMessage.id === oldestMessageId) {
        return
      }

      this.setState({loadingOlder: true})
      const olderLogs = await historyLogs(application.id, {
        before : oldestMessage.id,
        content: currentSearch
      })

      if (!olderLogs[0]) {
        this.setState({
          loadingOlder   : false,
          oldestMessageId: oldestMessage.id
        })
        return
      }

      let eventMessages: JSX.Element[] = []
      for (const log of olderLogs) {
        const eventElement = <LogMessage syslogMessage={log} id={log.id} key={log.id}/>
        eventMessages.unshift(eventElement)
      }

      // Go a bit down so the scroll position is fixated and doesn't move up with the newly loaded in messages
      scrollbar.scrollTop(1)
      this.setState({
        eventMessages: eventMessages.concat(this.state.eventMessages),
        loadingOlder : false
      })
    }
  }

  async searchContent (content: string) {
    const { currentSearch } = this.state
    const { application }   = this.props
    const scrollbar         = this.scrollBar.current!

    if (content === '' && currentSearch) {
      this.setState({
        mainLoading: true,
        eventMessages: []
      })
      await this.loadRecent()
      return this.setState({
        currentSearch: undefined
      })
    }

    this.setState({
      currentSearch: content
    })

    if (this.searchBarTimer) {
      clearTimeout(this.searchBarTimer)
    }
    
    this.searchBarTimer = setTimeout(async () => {
      this.setState({
        mainLoading  : true,
        eventMessages: []
      })

      const foundLogs = await searchLogs(application.id, content)
      this.setState({
        eventMessages: foundLogs.reverse().map((log) => {
          return <LogMessage syslogMessage={log} id={log.id} key={log.id} />
        }),
        mainLoading  : false
      })
      scrollbar.scrollToBottom()
    }, 300)
  }

  async loadRecent () {  
    const eventsElement   = document.getElementById('log-events')!
    const { application } = this.props

    const recentLogs = await getRecentLogs(application.id)
    this.setState({mainLoading: false})

    for (const log of recentLogs.reverse()) {
      const eventElement = <LogMessage syslogMessage={log} id={log.id!} key={log.id!}/>
      this.setState({
        eventMessages: this.state.eventMessages.concat([eventElement])
      })
      eventsElement.scrollIntoView(false)
    }
  }

  async componentDidMount () {
    const eventsElement   = document.getElementById('log-events')!
    const { application } = this.props
          this.socket     = new WebSocket(`wss://${hostname}/api/applications/${application.id}/trail`)
    
    // Load up the most recent messages
    this.loadRecent()

    this.socket.onopen = () => {
      console.log('WS connected opened')
    }
  
    this.socket.onmessage = (message) => {
      const { currentSearch }             = this.state
      const payload                       = JSON.parse(message.data)
      const payloadMessage: syslogMessage = payload.message

      // Check if the user is searching at the moment, if so, filter the message based on current search
      if (currentSearch) {
        const lowerCaseMessage = payloadMessage.message.toLowerCase()
        const lowercaseSearch  = currentSearch.toLowerCase()

        // Content check
        if (!lowerCaseMessage.includes(lowercaseSearch)) {
          return
        } 
      }

      const eventElement = <LogMessage syslogMessage={payloadMessage} id={payloadMessage.id} key={payloadMessage.id}/>

      if (!this.state.receivedFirst) {
        this.setState({receivedFirst: true})
        const recentBar = <RecentBar key="recent-bar"/>
        this.setState({
          eventMessages: this.state.eventMessages.concat([recentBar])
        })
      }
      
      if (this.state.eventMessages.length >= eventsLimit && this.state.tail) {
        const eventMessages = [...this.state.eventMessages].slice(0, eventsLimit)
        eventMessages.shift()
        eventMessages.push(eventElement)

        this.setState({
          eventMessages
        })
      } else {
        this.setState({
          eventMessages: this.state.eventMessages.concat([eventElement])
        })
      }
      
      if (this.state.tail) {
        eventsElement.scrollIntoView(false)
      }
    } 
  }

  componentWillUnmount () {
    this.socket.close(1000)
  }

  render () {
    const { loadingOlder } = this.state
    const searchBar        = <SearchBar key = "searchBar" onInput = {(event) => this.searchContent(event.target.value)}/>

    return (
      <AppNavBar session={this.props.session} customItems={[searchBar]}>
        <Helmet>
          <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/solid.js"/>
          <script defer src="https://use.fontawesome.com/releases/v5.8.2/js/fontawesome.js"/>
        </Helmet>
        <div className="flexbox" id="logs-container" style={{ backgroundColor: 'black' }}>
          <ScrollArea universal onScroll={this.onScroll} ref={this.scrollBar} renderThumbVertical={({ style, ...props }) =>
            <div {...props} className={`custom-scrollbar`} style={{ ...style }}/>
          }>
            <RotateLoader css={recentLoaderOverride} color={'#4e6277'} loading={this.state.mainLoading}/>
            <ul id="log-events" style={{marginLeft: 1}}>
              <BeatLoader key={'messageLoader'} css={olderLoaderOverride} color={'#4e6277'} loading={loadingOlder}/>
              {this.state.eventMessages}
            </ul>
          </ScrollArea>
        </div>
      </AppNavBar>
    )
  }
}