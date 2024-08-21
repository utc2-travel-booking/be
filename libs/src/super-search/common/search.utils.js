"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSearchConditionToPipeline = exports.createSearchPipeline = void 0;
const common_1 = require("@nestjs/common");
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../../src/constants/enums");
const createSearchPipeline = (search, searchType) => {
    if (!lodash_1.default.isObjectLike(search)) {
        return [];
    }
    const keys = Object.keys(search);
    const result = keys
        .map((key) => {
        const [field, operator] = key.split(':');
        if (!operator) {
            throw new common_1.UnprocessableEntityException('Invalid search query operator');
        }
        if (!field) {
            throw new common_1.UnprocessableEntityException('Invalid search query search by');
        }
        if (!search[key]) {
            return null;
        }
        if (lodash_1.default.upperCase(operator) === enums_1.OPERATOR.BETWEEN) {
            const [from, to] = search[key].split(',');
            const fromDate = new Date(from);
            const toDate = new Date(to);
            if (fromDate.toDateString() === toDate.toDateString()) {
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
            }
            return {
                field,
                operator,
                value: { from: fromDate, to: toDate },
            };
        }
        if (operator.toLocaleUpperCase() === enums_1.OPERATOR.IN ||
            operator.toLocaleUpperCase() === enums_1.OPERATOR.NOT_IN) {
            const array = search[key].split(',');
            for (let i = 0; i < array.length; i++) {
                if (Number(array[i])) {
                    array[i] = Number(array[i]);
                }
                if (lodash_1.default.isString(array[i])) {
                    array[i] = array[i].replace(/%3C/g, '<');
                }
            }
            return {
                field,
                operator,
                value: array,
            };
        }
        return {
            field,
            operator,
            value: Number(search[key]) ? Number(search[key]) : search[key],
        };
    })
        .filter((item) => item);
    const pipeline = [];
    result.forEach((item) => {
        const { field, operator, value } = item;
        (0, exports.addSearchConditionToPipeline)(pipeline, operator, field, value, searchType);
    });
    return pipeline;
};
exports.createSearchPipeline = createSearchPipeline;
const addSearchConditionToPipeline = (pipeline, operator, searchBy, keyword, searchType) => {
    operator = operator.toUpperCase();
    keyword = transformKeyword(keyword);
    const matchStage = {};
    switch (operator) {
        case enums_1.OPERATOR.LIKE:
            const words = lodash_1.default.words(keyword);
            const regexPattern = words.map(lodash_1.default.escapeRegExp).join('.*');
            matchStage[searchBy] = {
                $regex: new RegExp(regexPattern, 'i'),
            };
            break;
        case enums_1.OPERATOR.NOT_LIKE:
            matchStage[searchBy] = {
                $not: {
                    $regex: lodash_1.default.escapeRegExp(String(keyword)),
                    $options: 'i',
                },
            };
            break;
        case enums_1.OPERATOR.IN:
            matchStage[searchBy] = { $in: keyword };
            break;
        case enums_1.OPERATOR.NOT_IN:
            matchStage[searchBy] = { $nin: keyword };
            break;
        case enums_1.OPERATOR.BETWEEN:
            const { from, to } = keyword;
            matchStage[searchBy] = { $gte: from, $lte: to };
            break;
        case enums_1.OPERATOR.BEFORE:
            matchStage[searchBy] = {
                $lt: lodash_1.default.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case enums_1.OPERATOR.IS_AND_BEFORE:
            matchStage[searchBy] = {
                $lte: lodash_1.default.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case enums_1.OPERATOR.AFTER:
            matchStage[searchBy] = {
                $gt: lodash_1.default.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case enums_1.OPERATOR.IS_AND_AFTER:
            matchStage[searchBy] = {
                $gte: lodash_1.default.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case enums_1.OPERATOR.ISNULL:
            matchStage[searchBy] = { $exists: keyword };
            break;
        case enums_1.OPERATOR.NOT:
            matchStage[searchBy] = { $ne: keyword };
            break;
        case enums_1.OPERATOR.IS:
            matchStage[searchBy] = keyword;
            break;
        case enums_1.OPERATOR.IS_EMPTY:
            if (keyword === true) {
                matchStage[searchBy] = {
                    $exists: true,
                    $in: [null, '', []],
                };
            }
            else {
                matchStage[searchBy] = { $nin: [null, '', []] };
            }
            break;
        default:
            break;
    }
    if (searchType === enums_1.SearchType.AND) {
        if (lodash_1.default.get(pipeline, '[0].$match.$and')) {
            pipeline[0].$match.$and.push(matchStage);
        }
        else {
            pipeline.push({ $match: { $and: [matchStage] } });
        }
    }
    else if (searchType === enums_1.SearchType.OR) {
        if (lodash_1.default.get(pipeline, '[0].$match.$or')) {
            pipeline[0].$match.$or.push(matchStage);
        }
        else {
            pipeline.push({ $match: { $or: [matchStage] } });
        }
    }
};
exports.addSearchConditionToPipeline = addSearchConditionToPipeline;
const transformKeyword = (keyword) => {
    const keywordMap = {
        true: true,
        false: false,
        null: null,
    };
    if (typeof keyword === 'string') {
        const lowerKeyword = keyword.toLowerCase();
        if (keywordMap.hasOwnProperty(lowerKeyword)) {
            return keywordMap[lowerKeyword];
        }
        return mongoose_1.Types.ObjectId.isValid(keyword)
            ? new mongoose_1.Types.ObjectId(keyword)
            : keyword;
    }
    if (Array.isArray(keyword)) {
        return keyword.map((item) => transformKeyword(item));
    }
    return keyword;
};
//# sourceMappingURL=search.utils.js.map