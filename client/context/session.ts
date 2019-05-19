import { createContext } from "react"
import userSession from "../../types/session";

const sessionContext = createContext<userSession | null>(null)

export const SessionProvider = sessionContext.Provider
export const SessionConsumer = sessionContext.Consumer
