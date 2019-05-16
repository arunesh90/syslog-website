export interface syslogMessage {
  originalMessage: string,
  prival         : number,
  facilityID     : number,
  severityID     : number,
  facility       : string,
  severity       : string,
  type           : string,
  time           : string,
  host           : string,
  appName        : string,
  pid?           : number,
  structuredData : {[key: string]: any},
  message        : string,
  applicationId  : number,
  id             : number
}
