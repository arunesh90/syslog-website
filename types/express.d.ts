import application from "../entities/application"
import team from "../entities/applicationTeam"

declare global {
  namespace Express {
    export interface Request {
      application?: application
      team?       : team
    }
  }
}
