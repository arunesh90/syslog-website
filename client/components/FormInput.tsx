import { Component } from 'react'
import { Input } from 'bloomer'

export default class FormInput extends Component<FieldRenderProps<any>> {
  render () {
    const formInput = this.props.input

    return (
      <Input
        type     = {formInput.type}
        name     = {formInput.name}
        value    = {formInput.value}
        onChange = {formInput.onChange}
        onBlur   = {formInput.onBlur}
        onFocus  = {formInput.onFocus}
        checked  = {formInput.checked}
      />
    )
  }
}