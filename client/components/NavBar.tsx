import { Component } from "react"
import { Navbar, NavbarBrand, NavbarItem, NavbarMenu, NavbarEnd } from "bloomer"
import userSession from "../../types/session"
import Link from 'next/link'

interface NavBarProps {
  session     : userSession,
  customItems?: JSX.Element[]
}

export default class AppNavBar extends Component<NavBarProps> {
  render () {
    const { user }    = this.props.session
    const customItems = this.props.customItems ? this.props.customItems.map((customItem) => {
      return <NavbarItem key={customItem.key!}>{customItem}</NavbarItem>
    }): null
    
    return (
      <div className="flexcontainer">
        <div className="flexbox">
          <Navbar className="custom-navbar" style={{backgroundColor: 'rgb(44, 57, 71)'}}>
            <NavbarBrand>
              <NavbarItem>
                <Link prefetch passHref href={'/app/dashboard'}>
                  <a>
                    <figure className="image is-32x32">
                      <img src="/static/img/logIcon.svg" style={{ transform: 'scale(1.25)' }} />
                    </figure>
                  </a>
                </Link>
                <p id="app-title">Syslog</p>
              </NavbarItem>
            </NavbarBrand>
            <NavbarMenu>
              <NavbarEnd>
                {customItems}
                <NavbarItem>
                  <figure className="image">
                    <img className="is-rounded" src={user!.github.avatar_url} style={{ width: 28, height: 28 }} />
                  </figure>
                </NavbarItem>
              </NavbarEnd>
            </NavbarMenu>
          </Navbar>
        </div>
        {this.props.children}
      </div>
    )
  }
}
