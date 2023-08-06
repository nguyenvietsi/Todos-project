/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  userId: string
  todoId: string
  name: string
  wish: string
  done: boolean
}