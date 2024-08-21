"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindWithMultipleLanguage = void 0;
const super_request_context_1 = require("../../super-request-context");
const find_utils_1 = require("../common/find.utils");
const lodash_1 = __importDefault(require("lodash"));
const appsettings_1 = require("../../../../src/configs/appsettings");
function FindWithMultipleLanguage() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const req = lodash_1.default.get(super_request_context_1.RequestContext, 'currentContext.req', null);
            if (!req) {
                return originalMethod.apply(this, args);
            }
            const query = lodash_1.default.get(req, 'query', {});
            const locale = lodash_1.default.get(query, 'locale', appsettings_1.appSettings.mainLanguage);
            const [filter, pipeline] = args;
            const _pipeline = (0, find_utils_1.findDocumentMultipleLanguage)(this.entity, locale);
            const updatedArgs = [filter, [..._pipeline, ...(pipeline || [])]];
            try {
                const result = originalMethod.apply(this, updatedArgs);
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        return descriptor;
    };
}
exports.FindWithMultipleLanguage = FindWithMultipleLanguage;
//# sourceMappingURL=find-with-multiple-language.decorator.js.map