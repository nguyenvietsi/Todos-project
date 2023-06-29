import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
const XAWS = AWSXRay.captureAWS(AWS)
const LOGGER = createLogger('attachmentUtils')

// TODO: Implement the dataLayer logic
export class AttachmentUtils {
    constructor(
        private readonly  s3 = new XAWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}
    
    async getAttachmentUtils(todoId: string): Promise<string> {
        LOGGER.info('Get url')
        return await this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration)
        })
    }
}