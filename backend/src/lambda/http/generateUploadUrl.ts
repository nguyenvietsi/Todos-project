import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateAttachmentUrl } from '../../businessLogic/todos'
import { getUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const parseUserId = getUserId(event)
    const parseAttachmentUrl = 'https://${process.env.TODO_S3_BUCKET_NAME}.s3.amazonaws.com/${todoId}'
    await updateAttachmentUrl(
      todoId,
      parseUserId,
      parseAttachmentUrl
    )
    const signedUrl = await getUrl(todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        signedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
