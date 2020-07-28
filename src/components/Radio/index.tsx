import React from 'react'
import { Form, Radio, Header } from 'semantic-ui-react'

interface Props {
  label: string
  value: any
  list: Array<{
    label: string
    value: string
  }>
  onChange: (value: any) => void
}
interface State {}

const ReRadio: React.FunctionComponent<Props> = ({
  label,
  list,
  value,
  onChange,
  children
}) => {
  return (
    <Form>
      <Form.Field>
        <Header>{label}</Header>
      </Form.Field>
      {children}
      {list.map((item, i) => (
        <Form.Field key={i}>
          <Radio
            label={item.label}
            value={item.value}
            checked={item.value === value}
            onChange={(e, data) => onChange(data.value as string)}
          />
        </Form.Field>
      ))}
    </Form>
  )
}

export default ReRadio
