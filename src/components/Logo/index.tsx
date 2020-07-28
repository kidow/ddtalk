import Logo from 'static/logo.svg'
import React from 'react'
import { Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

interface Props {}
interface State {}

const ReLogo: React.FunctionComponent<Props> = () => {
  return (
    <Link to="/" style={{ display: 'flex' }}>
      <Image src={Logo} alt="logo" style={{ cursor: 'pointer' }} />
    </Link>
  )
}

export default ReLogo
