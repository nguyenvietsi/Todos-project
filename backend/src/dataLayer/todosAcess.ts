import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const LOGGER = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODOS_TABLE) {}
    async create(todoItem: TodoItem): Promise<TodoItem> {
        LOGGER.info('Start insert a new item')
        const query: DocumentClient.PutItemInput = {
            TableName: this.todoTable,
            Item: todoItem
        }
        await this.docClient.put(query).promise()
        LOGGER.info('New item inserted')
        return todoItem
    }
    async delete(userId: string, todoId: string): Promise<void> {
        LOGGER.info('Start delete item')
        await this.docClient
        .delete({
            TableName: this.todoTable,
            Key: {
                todoId,
                userId
            }
        })
        .promise()
    }

    async updateImageUrl(updateUrl : any): Promise<TodoItem> {
        LOGGER.info('Start update todo attachment image')

        await this.docClient
        .update({
            TableName: this.todoTable,
            Key: {
                todoId: updateUrl.todoId,
                userId: updateUrl.userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': updateUrl.attachmentUrl
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()
        
        LOGGER.info('attachment image updated')
        return updateUrl
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        LOGGER.info('Getting all items')
        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        const items = result.Items
        return items as TodoItem[]
    }

    async update(updateTodo: any): Promise<TodoItem> {
        LOGGER.info('Update todo item')
        await this.docClient
        .update({
            TableName: this.todoTable,
            Key: {
            todoId: updateTodo.todoId,
            userId: updateTodo.userId
            },
            ExpressionAttributeNames: { '#N': 'name' },
            UpdateExpression:
                'set #N = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': updateTodo.name,
                ':dueDate': updateTodo.dueDate,
                ':done': updateTodo.done
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()
        
        LOGGER.info('finish update items')
        return updateTodo as TodoItem
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        LOGGER.info('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8001'
        })
    }
    return new XAWS.DynamoDB.DocumentClient()
}
  