import { WebsocketRequestHandler } from "express-ws"
import { pubsub } from "../../database/redis"

const wsHandler: WebsocketRequestHandler = (ws, req) => {
  const { applicationId } = req.params
  const channelName = `syslog-${applicationId}`

  function pubsubHandler (channel: string, message: string) {
    if (channel === channelName && ws.readyState === 1) {
      ws.send(message)
    }
  }

  pubsub.subscribe(channelName)
  pubsub.on('message', pubsubHandler)
  
  ws.onclose = () => {
    pubsub.unsubscribe(channelName)
    pubsub.removeListener(channelName, pubsubHandler)
  }
}

export default wsHandler
