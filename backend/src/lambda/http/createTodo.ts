import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const parseBody:CreateTodoRequest = JSON.parse(event.body)
    if (!parseBody.name || !parseBody.dueDate) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'Name or Date is empty!'
      }
    }
    const parseUserId = getUserId(event)
    // TODO: Implement creating a new TODO item
    const TodoItem = await createTodo(parseBody, parseUserId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: TodoItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
