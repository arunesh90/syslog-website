import applicationEntity from "../../entities/application"
import { hostname } from "../../utils/constants"

export default (application: applicationEntity, eventList: HTMLElement) => {
  const socket = new WebSocket(`wss://${hostname}/api/applications/${application.id}/trail`)

  socket.onopen = () => {
    console.log('WS connected opened')
  }

  socket.onmessage = (message) => {
    const parsed = JSON.parse(message.data)
    const syslogMessage = parsed.message

    const eventElement           = document.createElement('li')
          eventElement.innerText = `${syslogMessage.appName} - ${syslogMessage.message}`
    
    eventList.appendChild(eventElement)
  }
}
