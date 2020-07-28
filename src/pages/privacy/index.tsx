import React, { FunctionComponent } from 'react'
import { RePrivacy, ReSEO } from 'components'

export interface Props {}
interface State {}

const Privacy: FunctionComponent<Props> = () => {
  return (
    <div style={{ padding: 16 }}>
      '
      <ReSEO title="개인정보취급방침" />
      <RePrivacy />
    </div>
  )
}

export default Privacy
