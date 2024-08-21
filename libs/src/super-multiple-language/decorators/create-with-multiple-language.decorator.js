"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWithMultipleLanguage = void 0;
const create_utils_1 = require("../common/create.utils");
const lodash_1 = __importDefault(require("lodash"));
const appsettings_1 = require("../../../../src/configs/appsettings");
const super_request_context_1 = require("../../super-request-context");
function CreateWithMultipleLanguage() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const req = lodash_1.default.get(super_request_context_1.RequestContext, 'currentContext.req', null);
            if (!req) {
                return originalMethod.apply(this, args);
            }
            const query = lodash_1.default.get(req, 'query', {});
            const locale = lodash_1.default.get(query, 'locale', appsettings_1.appSettings.mainLanguage);
            const [doc] = args;
            await (0, create_utils_1.createDocumentMultipleLanguage)(this.entity, doc, locale, Array.isArray(doc));
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.CreateWithMultipleLanguage = CreateWithMultipleLanguage;
//# sourceMappingURL=create-with-multiple-language.decorator.js.map