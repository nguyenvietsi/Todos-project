import React from 'react'
import Auth from './auth/Auth'
import { Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import { InviteCard } from './components/InviteCard'
import createHistory from 'history/createBrowserHistory'
import App from './App';
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
     auth.handleAuthentication()
  }
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <div>
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route
          path="/InviteCard"
          render={props => {
            return <InviteCard />
          }}
        />
        <Route
          path="/todos*"
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
        <Route
          path="/"
          exact 
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
      </div>
    </Router>
  )
}
