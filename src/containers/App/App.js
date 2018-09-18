import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router } from 'react-router'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ThemeSettings from 'theme'

const theme = createMuiTheme(ThemeSettings)

const App = ({ routes, store, persistor }) => (
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={browserHistory}>{routes}</Router>
      </PersistGate>
    </Provider>
  </MuiThemeProvider>
)

App.propTypes = {
  routes: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default App
