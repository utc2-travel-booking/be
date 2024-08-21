import { NestMiddleware } from '@nestjs/common';
export declare class RequestContextMiddleware<Request = any, Response = any> implements NestMiddleware<Request, Response> {
    use(req: Request, res: Response, next: () => void): void;
}
