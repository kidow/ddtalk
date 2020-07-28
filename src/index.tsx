import 'dotenv/config'
import 'services/styles/index.scss'
import 'moment/locale/ko'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from 'store'

const rootElement = document.getElementById('root')
const rootComponent = (
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)

if (rootElement?.hasChildNodes()) ReactDOM.hydrate(rootComponent, rootElement)
else ReactDOM.render(rootComponent, rootElement)

serviceWorker.unregister()
