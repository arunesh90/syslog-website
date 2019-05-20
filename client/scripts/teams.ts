import { NextContext } from 'next'
import sendAPIRequest from './api'
import applicationTeam from '../../entities/applicationTeam'

export const getTeams = async (ctx: NextContext): Promise<applicationTeam[]> => {
  return sendAPIRequest('teams/list', ctx)
}
