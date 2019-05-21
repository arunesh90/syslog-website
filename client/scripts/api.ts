import { NextContext } from 'next'
import fetch from 'isomorphic-fetch'
import { protocol, hostname } from '../../utils/constants'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

export interface requestOptions {
  ctx?   : NextContext,
  method?: 'GET' | 'POST',
  body  ?: any,
}

export default async function sendAPIRequest<responseType = any> (apiPath: string, options?: requestOptions): Promise<responseType> {
  const req = (options && options.ctx) ? options.ctx.req : null

  const prefix = req ? `${protocol}${hostname}` : window.location.origin
  let reqOptions: RequestInit = {
    method     : 'GET',
    credentials: 'include'
  }

  if (req) {
    reqOptions.headers = {
      cookie: req.headers.cookie!
    }
  } if (options) {
    if (options.method) {
      reqOptions.method = options.method
    } if (options.body) {
      reqOptions.body = options.body
    }
  }
  const url = `${prefix}/api/${apiPath}`
  console.log(url)

  const res = await fetch(url, reqOptions)
  return res.json()
}

export async function postAPIRequest (apiPath: string, options?: requestOptions): Promise<AxiosResponse> {
  const req = (options && options.ctx) ? options.ctx.req : null

  const prefix = req ? `${protocol}${hostname}` : window.location.origin
  
  const url = `${prefix}/api/${apiPath}`
  console.log(url)

  let reqOptions: AxiosRequestConfig = {
    method: 'post',
    url
  }
  
  if (options && options.body) {
    reqOptions.data = options.body
  }

  const res = await axios({
    method: 'post',
    data: options!.body,
    url
  })

  return res.data
}