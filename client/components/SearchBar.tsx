import { Component, FormEvent, ChangeEvent } from "react"

interface SearchBarProps {
  onInput: ((event: ChangeEvent<HTMLInputElement>) => void)
}

export default class SearchBar extends Component<SearchBarProps> {
  render () {
    return (
      <div className="field">
        <div id="outerSearchBar" className="control has-icons-right">
          <input type="text" placeholder="Search log content.." spellCheck={false} onChange={this.props.onInput} className="input is-rounded searchBar" />
          <span className="icon is-small is-right">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
    )
  }
}
