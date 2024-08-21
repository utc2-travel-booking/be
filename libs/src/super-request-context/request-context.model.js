"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
class RequestContext {
    static get currentContext() {
        return this.cls.getStore();
    }
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
}
exports.RequestContext = RequestContext;
RequestContext.cls = new async_hooks_1.AsyncLocalStorage();
//# sourceMappingURL=request-context.model.js.map