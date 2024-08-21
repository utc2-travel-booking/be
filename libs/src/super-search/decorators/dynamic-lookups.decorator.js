"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicLookup = void 0;
const aggregates_1 = require("../aggregates");
function DynamicLookup() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const [filter, pipeline] = args;
            const _pipeline = (0, aggregates_1.dynamicLookupAggregates)(this.entity);
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
exports.DynamicLookup = DynamicLookup;
//# sourceMappingURL=dynamic-lookups.decorator.js.map