"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = void 0;
const lodash_1 = __importDefault(require("lodash"));
const crypto_1 = __importDefault(require("crypto"));
const generateKey = (serialized) => {
    const orderObject = (obj) => {
        if (lodash_1.default.isArray(obj)) {
            return obj.map(orderObject);
        }
        else if (lodash_1.default.isPlainObject(obj)) {
            return (0, lodash_1.default)(obj)
                .toPairs()
                .sortBy(0)
                .map(([k, v]) => [k, orderObject(v)])
                .fromPairs()
                .value();
        }
        return obj;
    };
    const ordered = orderObject(serialized);
    const jsonString = JSON.stringify(ordered);
    const hash = crypto_1.default.createHash('sha256');
    hash.update(jsonString);
    return hash.digest('hex');
};
exports.generateKey = generateKey;
//# sourceMappingURL=genarate-key.utils.js.map