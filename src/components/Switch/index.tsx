import React from 'react'
import Switch from 'react-switch'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}
interface State {}

const ReSwitch: React.FunctionComponent<Props> = ({ checked, onChange }) => {
  return <Switch checked={checked} onChange={onChange} />
}

export default ReSwitch
