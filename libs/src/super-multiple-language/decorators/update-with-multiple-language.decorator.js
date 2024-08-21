"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWithMultipleLanguage = void 0;
const update_utils_1 = require("../common/update.utils");
const appsettings_1 = require("../../../../src/configs/appsettings");
const lodash_1 = __importDefault(require("lodash"));
const super_request_context_1 = require("../../super-request-context");
function UpdateWithMultipleLanguage() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const req = lodash_1.default.get(super_request_context_1.RequestContext, 'currentContext.req', null);
            if (!req) {
                return originalMethod.apply(this, args);
            }
            const query = lodash_1.default.get(req, 'query', {});
            const locale = lodash_1.default.get(query, 'locale', appsettings_1.appSettings.mainLanguage);
            const [filter, update] = args;
            await (0, update_utils_1.updateDocumentMultipleLanguage)(this.model, this.entity, filter, update, locale);
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.UpdateWithMultipleLanguage = UpdateWithMultipleLanguage;
//# sourceMappingURL=update-with-multiple-language.decorator.js.map