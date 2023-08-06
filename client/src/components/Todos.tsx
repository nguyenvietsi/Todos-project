import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Dropdown,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'
import '../style/Todos.css'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }
  onMakeNewButtonClick = () => {
    this.props.history.push(`/todos/new`)
  }

  onTodoDelete = async (todoId: string, createdAt: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId, createdAt)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
      console.log(todos)
      
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button
            icon
            onClick={() => this.onMakeNewButtonClick()}
          ><Icon name="add"style ={{color:"#B1B0B2"}}/> New Invition Card</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded  >
        {this.state.todos.map((todo, pos) => {
          //todo.attachmentUrl = "https://udacity-serverless-c4-todo-images-dev.s3.amazonaws.com/1cb199b9-14c1-47ce-ae75-e3d58b2cc667"
          return (
            <Grid.Row key={todo.todoId} className="homeBorder" >
              <Grid.Column className='name' width={10} verticalAlign="middle"> 
                {todo.name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Dropdown icon='big ellipsis horizontal' style ={{color:"#976164"}}>
                  <Dropdown.Menu>
                    <Dropdown.Item text='Edit post' icon='edit' style ={{color:"#976164"}}  onClick={() => this.onEditButtonClick(todo.todoId)}/>
                    <Dropdown.Item text='Delete post' icon='trash alternate'  style ={{color:"#976164"}} onClick={() => this.onTodoDelete(todo.todoId, todo.createdAt)}/>
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">   &nbsp;
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">   &nbsp;
              </Grid.Column>
              <Grid.Column className='wish' width={10} verticalAlign="middle">
                {todo.wish}
              </Grid.Column>
              <Grid.Column className='wish' width={10} verticalAlign="middle">   &nbsp;
              </Grid.Column>
              <Grid.Column width={16} verticalAlign="middle">
                {todo.done && (
                  <Image src={todo.attachmentUrl} wrapped />
                )}
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
