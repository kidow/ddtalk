import React, { FunctionComponent } from 'react'
import { ReTerms, ReSEO } from 'components'

export interface Props {}

const Terms: FunctionComponent<Props> = () => {
  return (
    <div style={{ padding: 16 }}>
      <ReSEO title="이용약관" />
      <ReTerms />
    </div>
  )
}

export default Terms
