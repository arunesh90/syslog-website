import { NextContext } from "next"
import userSession from "../../types/session"
import sendAPIRequest from "./api"

export const getSession = async (ctx: NextContext): Promise<userSession> => {
  return sendAPIRequest('session/info', { ctx })
}
