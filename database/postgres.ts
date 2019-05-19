import { createConnection } from "typeorm"
import application from "../entities/application"
import applicationTeam from "../entities/applicationTeam"
import applicationUser from "../entities/applicationUser"

export default async function connect () {
  return createConnection({
    type       : 'postgres',
    url        : process.env.SQL_URI,
    database   : 'syslog',
    synchronize: true,
    entities   : [
      application,
      applicationTeam,
      applicationUser
    ]
  })
}
