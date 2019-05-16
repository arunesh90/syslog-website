import { NextContext } from 'next'
import fetch from 'isomorphic-fetch'
import { protocol, hostname } from '../../utils/constants'

export default async function sendAPIRequest<responseType = any> (apiPath: string, ctx?: NextContext): Promise<responseType> {
  const req = ctx ? ctx.req : null

  const prefix = req ? `${protocol}${hostname}` : window.location.origin
  let reqOptions: RequestInit = {
    method     : 'GET',
    credentials: 'include'
  }

  if (req) {
    reqOptions.headers = {
      cookie: req.headers.cookie!
    }
  }

  const url = `${prefix}/api/${apiPath}`
  console.log(url)

  const res = await fetch(url, reqOptions)
  return res.json()
}