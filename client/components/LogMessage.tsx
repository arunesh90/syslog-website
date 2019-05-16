import { Component } from "react"
import { syslogMessage as syslogMessageType } from "../../types/syslog"
import dayjs from 'dayjs'

interface LogMessageProps {
  syslogMessage: syslogMessageType,
  id           : number
}

export default class LogMessage extends Component<LogMessageProps> {
  render () {
    const { syslogMessage }          = this.props
    const { time, appName, message } = syslogMessage

    return (
      <li className="logEvent">
        <time className="logTime" dateTime={time}>{dayjs(time).format('D MMM HH:mm:ss')} </time>
        <span className="logHostname">{appName}</span> - <span className="logMessage">{message}</span>
      </li>
    )
  }
}
