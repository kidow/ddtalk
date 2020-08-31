import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Icon, Dimmer, Loader } from 'semantic-ui-react'
import {
  googleLogin,
  getRedirectResult,
  useObject,
  useQuery,
  logEvent,
  githubLogin,
  authError,
  facebookLogin
} from 'services'
import { useDispatch } from 'react-redux'
import { AuthActions } from 'store'
import { ReSEO, ReLogo } from 'components'
import { isMobile } from 'react-device-detect'

interface Props {}
interface State {
  loading: boolean
}

const Login: React.FunctionComponent<Props> = () => {
  const { push } = useHistory()
  const [{ loading }, setState] = useObject<State>({ loading: true })
  const dispatch = useDispatch()
  const { redirect } = useQuery<{ redirect: string }>()
  const get = async () => {
    try {
      const { user } = await getRedirectResult()
      if (!user) return
      dispatch(AuthActions.ME())
      logEvent('로그인_성공')
      push(redirect || '/')
    } catch (err) {
      authError(err.code)
      logEvent('로그인_실패')
    } finally {
      setState({ loading: false })
    }
  }
  useEffect(() => {
    get()
  }, [])
  return (
    <>
      <ReSEO title="로그인" />
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          {isMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <ReLogo />
            </div>
          )}
          <Button
            style={{ width: 165 }}
            color="google plus"
            onClick={googleLogin}
          >
            <Icon name="google" /> 구글로 로그인
          </Button>
          <br />
          <Button
            style={{ margin: '8px 0', width: 165 }}
            secondary
            onClick={githubLogin}
          >
            <Icon name="github" /> 깃허브 로그인
          </Button>
          <br />
          <Button
            style={{ width: 165 }}
            color="facebook"
            onClick={facebookLogin}
          >
            <Icon name="facebook" /> 페이스북 로그인
          </Button>
        </div>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
      </div>
    </>
  )
}

export default Login
