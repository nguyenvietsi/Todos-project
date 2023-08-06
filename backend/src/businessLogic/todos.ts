import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoPublicItem } from '../models/TodoPublicItem'
import { CreateNewInvRequest } from '../requests/CreateNewInvRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
// TODO: Implement businessLogic
const LOGGER = createLogger("businessLogic");

export async function createTodo(
    parseBody: CreateNewInvRequest,
    parseUserId: string
    ): Promise<TodoItem> {
    LOGGER.info('Start create a new item')
    const parseAttachmentUrl = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${ parseBody.userID}`
    await todosAccess.createPublic({
        todoId: parseBody.userID,
        partyName: parseBody.partyName,
        name: parseBody.name,
        dueDate: parseBody.dueDate,
        inviteDate: parseBody.inviteDate,
        address: parseBody.address,
        wish: null,
        attachmentUrl: parseAttachmentUrl,
        createdAt: new Date().toISOString(),
        done: false
    })
    return await todosAccess.create({
        todoId: parseBody.userID,
        partyName: parseBody.partyName,
        userId: parseUserId,
        name: parseBody.name,
        dueDate: parseBody.dueDate,
        inviteDate: parseBody.inviteDate,
        address: parseBody.address,
        wish: null,
        attachmentUrl: parseAttachmentUrl,
        createdAt: new Date().toISOString(),
        done: false
    })
}

export async function deleteTodo(
    todoId: string,
    parseUserId: string,
    createdAt: string
    ): Promise<void> {
    LOGGER.info('Start delete a item')
    return await todosAccess.delete(todoId, parseUserId, createdAt)
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

export async function updateTodo(todoId: string, updateTodo: UpdateTodoRequest): Promise<TodoItem> {
    LOGGER.info('Update todo')
    return await todosAccess.update({
        todoId: todoId,
        userId: updateTodo.userId,
        name: updateTodo.name,
        wish: updateTodo.wish,
        done: updateTodo.done
    })
}

export async function getTodos(userId: string): Promise<TodoItem[]>{
    LOGGER.info('Get all items')
    return todosAccess.getTodos(userId)
}
export async function getOneTodos(todoId: string): Promise<TodoPublicItem[]>{
    LOGGER.info('Get one items')
    return todosAccess.getOneTodos(todoId)
}

