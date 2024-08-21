/// <reference types="node" />
import { AsyncLocalStorage } from 'async_hooks';
export declare class RequestContext<TRequest = any, TResponse = any> {
    readonly req: TRequest;
    readonly res: TResponse;
    static cls: AsyncLocalStorage<RequestContext<any, any>>;
    static get currentContext(): RequestContext<any, any>;
    constructor(req: TRequest, res: TResponse);
}
