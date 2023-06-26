import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
// TODO: Implement businessLogic
const LOGGER = createLogger("businessLogic");

export async function createTodo(
    parseBody: CreateTodoRequest,
    parseUserId: string
    ): Promise<TodoItem> {
    LOGGER.info('Start create a new item')
    return await todosAccess.create({
        todoId: uuid.v4(),
        userId: parseUserId,
        name: parseBody.name,
        dueDate: parseBody.dueDate,
        attachmentUrl: null,
        createdAt: new Date().toISOString(),
        done: false
    })
}

export async function deleteTodo(
    todoId: string,
    parseUserId: string
    ): Promise<void> {
    LOGGER.info('Start delete a item')
    return await todosAccess.delete(todoId, parseUserId)
}

export async function updateAttachmentUrl(
    todoId: string,
    parseUserId: string,
    parseAttachmentUrl: string
    ): Promise<TodoItem> {
    LOGGER.info('Update attachment url')
    return await todosAccess.updateImageUrl({
        userId: parseUserId,
        todoId: todoId,
        attachmentUrl: parseAttachmentUrl
    })
}

export async function getUrl(todoId: string): Promise<string> {
    LOGGER.info('Get url')
    return await attachmentUtils.getAttachmentUtils(todoId)
}

export async function updateTodo(parseUserId: string, todoId: string, updateTodo: UpdateTodoRequest): Promise<TodoItem> {
    LOGGER.info('Update todo')
    return await todosAccess.update({
        todoId: todoId,
        userId: parseUserId,
        name: updateTodo.name,
        dueDate: updateTodo.dueDate,
        done: updateTodo.done
    })
}

export async function getTodos(userId: string): Promise<TodoItem[]>{
    LOGGER.info('Get all items')
    return todosAccess.getTodos(userId)
}

