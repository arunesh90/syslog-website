import { createContext } from "react"
import applicationEntity from "../../entities/application";

const applicationsContext = createContext<applicationEntity[] | null>(null)

export const ApplicationsProvider = applicationsContext.Provider
export const ApplicationsConsumer = applicationsContext.Consumer
