import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateNewInv } from '../types/CreateNewInv';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos?todoId=all`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}
export async function getOneTodos(todoId: string): Promise<Todo[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/getOneTodos?todoId=${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createTodo(
  idToken: string,
  newTodo: CreateNewInv
): Promise<Todo> {
  console.log(newTodo)
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTodo(
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.post(`${apiEndpoint}/todos/${updatedTodo.todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string,
  createdAt: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}/${createdAt}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}
export async function getUrl(
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/getUrl/${todoId}`, '', {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
