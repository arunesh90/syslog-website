import { createConnection } from "typeorm"
import application from "../entities/application"
import applicationTeam from "../entities/applicationTeam"
import applicationUser from "../entities/applicationUser"

export default async function connect () {
  return createConnection({
    type       : 'mysql',
    url        : process.env.SQL_URI,
    database   : 'syslog',
    entities   : [application, applicationTeam, applicationUser],
    synchronize: true
  })
}
