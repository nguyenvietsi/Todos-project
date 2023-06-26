import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodos} from '../../businessLogic/todos
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
  const parseUserId = getUserId(event)
  const todoItems = await getTodos(parseUserId)
  return {
    statusCode: 200,
    body: JSON.stringify({
      todoItems
    })
  }
}) 
    

handler.use(
  cors({
    credentials: true
  })
)
