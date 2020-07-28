import React, { PureComponent } from 'react'
import { ReRoutes, ReRooms } from 'components'
import store, { AuthActions } from 'store'
import { SemanticToastContainer } from 'react-semantic-toasts'
import 'react-semantic-toasts/styles/react-semantic-alert.css'
import * as Sentry from '@sentry/browser'
import { BrowserOptions } from '@sentry/browser'
import { captureException } from 'services'
import TagManager from 'react-gtm-module'

let options: BrowserOptions = {
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  maxBreadcrumbs: 50,
  attachStacktrace: true
}

if (process.env.NODE_ENV !== 'production') {
  options.beforeSend = () => null
  options.integrations = (int) =>
    int.filter(({ name }) => name !== 'Breadcrumbs')
}

Sentry.init(options)

interface State {
  hasError: boolean
  errorEventId: string
}
export interface Props {}

class App extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      errorEventId: ''
    }
    store.dispatch(AuthActions.ME())
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      hasError: state.hasError || false,
      errorEventId: state.errorEventId || undefined
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err: Error, { componentStack }: React.ErrorInfo) {
    captureException({
      err,
      type: 'componentDidCatch',
      message: componentStack
    })
    if (err) this.setState({ hasError: true })
  }

  componentDidMount() {
    TagManager.initialize({ gtmId: 'GTM-MT5CCSP' })
  }

  render() {
    return (
      <div
        className="container"
        style={{ width: 1127, maxWidth: '100%', margin: '0 auto' }}
      >
        <div style={{ display: 'flex' }}>
          <ReRooms />
          <ReRoutes />
          <SemanticToastContainer />
        </div>
      </div>
    )
  }
}

export default App
