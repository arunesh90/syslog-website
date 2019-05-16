  import { Component } from "react"
import { NextContext } from "next"
import Link from 'next/link'
import { hostname } from "../../utils/constants"
import { Button } from "bloomer/lib/elements/Button"

interface websocketTestProps {
  cookies: Record<string, string | undefined>
}

const websocketURL = `wss://${hostname}/api/applications/1/trail`

import '../styles/bulma.scss'

export default class websocketTest extends Component<websocketTestProps> {
  private socket: WebSocket

  componentDidMount() {
    this.socket = new WebSocket(websocketURL)

    this.socket.onopen = () => {
      console.log('WS connection opened')
    }

    this.socket.onmessage = (message) => {
      const parsed = JSON.parse(message.data)
      const syslogMessage = parsed.message
      
      document.getElementById('logs')!.innerHTML 
        += `<pre><b>${syslogMessage.appName}</b> - ${syslogMessage.message}</pre>`
    }
  }

  handleMessages (message: any) {
    console.log(message)
  }

  render () {
    return (
      <div>
        <Link href='/'><Button isColor='primary'>Back</Button></Link>
        <div id="logs"></div>
      </div>
    )
  }
}