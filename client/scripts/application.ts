import { NextContext } from "next"
import applicationEntity from "../../entities/application"
import { syslogMessage } from "../../types/syslog"
import sendAPIRequest from "./api"

export const getApplications = async (ctx: NextContext): Promise<applicationEntity[]> => {
  return sendAPIRequest('applications/list', ctx)
}

export const getApplication = async (ctx: NextContext, applicationId: string): Promise<applicationEntity> => {
  return sendAPIRequest(`applications/${applicationId}`, ctx)
}

export const getRecentLogs = async (applicationId: number): Promise<syslogMessage[]> => {
  return sendAPIRequest(`applications/${applicationId}/logs/recent`)
}

interface logHistoryOptions {
  before  : number,
  content?: string
}

export const historyLogs = async (applicationId: number, searchOptions: logHistoryOptions): Promise<syslogMessage[]> => {
  let apiURL = `applications/${applicationId}/logs/history?before=${searchOptions.before}`

  if (searchOptions.content) {
    apiURL += `&content=${encodeURI(searchOptions.content)}`
  }
  console.log(apiURL)
  return sendAPIRequest(apiURL)
}

export const searchLogs = async (applicationId: number, content: string): Promise<syslogMessage[]> => {
  return sendAPIRequest(`applications/${applicationId}/logs/search?content=${encodeURI(content)}`)
}
