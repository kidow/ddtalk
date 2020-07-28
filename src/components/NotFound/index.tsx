import React, { FunctionComponent, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { logEvent } from 'services'

export interface Props {}

const ReNotFound: FunctionComponent<Props> = () => {
  const { push } = useHistory()
  useEffect(() => {
    logEvent('404_페이지')
    push('/')
  }, [])
  return <></>
}

export default ReNotFound
