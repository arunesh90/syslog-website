import { createContext } from 'react'
import applicationTeam from '../../entities/applicationTeam'

const teamsContext = createContext<applicationTeam[] | null>(null)

export const TeamsProvider = teamsContext.Provider
export const TeamsConsumer = teamsContext.Consumer
