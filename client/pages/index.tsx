import { Component } from "react"

import '../styles/home.scss'

export default class IndexPage extends Component {
 render () {
   return (
      <div className="centerBody">
        <div className="githubCard">
          <img src="/static/img/GitHub-Mark-Light-120px-plus.png" alt="" className="logo"/>
          <a href="/auth/github" className="button loginButton">Login</a>
        </div>
      </div>
    )
  }
}
