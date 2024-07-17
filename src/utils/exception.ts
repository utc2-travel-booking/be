import { BadRequestException } from '@nestjs/common';

export class CustomRequestException extends BadRequestException {
    constructor({
        message,
        errorCode = 0,
        data = null,
    }: {
        message: string;
        errorCode?: number;
        data?: any;
    }) {
        super({ message, errorCode, data });
    }
}
