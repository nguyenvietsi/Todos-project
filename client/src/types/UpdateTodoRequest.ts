export interface UpdateTodoRequest {
  userId: string
  todoId: string
  name: string
  wish: string
  done: boolean
}