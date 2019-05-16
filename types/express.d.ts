import application from "../entities/application"

declare global {
  namespace Express {
    export interface Request {
      application?: application
    }
  }
}
