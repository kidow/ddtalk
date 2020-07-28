import React, { FunctionComponent } from 'react'
import { Divider } from 'semantic-ui-react'
import { ReChangeLog, ReIntro, ReSEO } from 'components'

export interface Props {}
interface State {
  open: boolean
}

const Main: FunctionComponent<Props> = () => {
  return (
    <>
      <ReSEO title="" />
      <ReIntro />
      <ReChangeLog />
    </>
  )
}

export default Main
