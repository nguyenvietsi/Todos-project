import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Icon, Segment, Dropdown} from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'

import { MakeNewInv } from './components/MakeNewInv'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'
import './style/Home.css'
export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{padding: '2em 0em'}} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row >
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  <div className="userInfo">{this.logInLogOutButton()}</div>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {

    return (
      <div className="topnav">
        <Link className="app-name" to="/todos"><Icon name="home" style ={{color:"#e57c9c"}}/>Wedding App</Link>
      </div>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Dropdown icon='user circle' style ={{color:"#976164",zIndex:0,'font-size':"300%"}}>
          <Dropdown.Menu>
            <Dropdown.Item text='Sign out' icon='large log out'  style ={{color:"#976164"}} onClick={this.handleLogout} />
          </Dropdown.Menu>
        </Dropdown>
      )
    } else {
      return (
        <button className="signInOut" name="login" onClick={this.handleLogin}>
          <Icon name="sign in" size="large" style ={{color:"#B1B0B2"}}/>
        </button>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/todos"
          exact
          render={props => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos/:todoId/edit"
          exact
          render={props => {
            return <EditTodo {...props} auth={this.props.auth} />
          }}
        />
        <Route
          path="/todos/new"
          exact
          render={props => {
            return <MakeNewInv {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
