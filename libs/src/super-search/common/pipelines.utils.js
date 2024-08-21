"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllLookup = exports.sortPipelines = exports.projectionConfig = void 0;
const lodash_1 = __importDefault(require("lodash"));
const projectionConfig = (pipeline, projection) => {
    const projections = projection.toString().split(' ');
    const project = projections.reduce((acc, cur) => {
        const _cur = cur.split('-');
        if (_cur.length > 1) {
            acc[_cur[1]] = 0;
        }
        else {
            acc[cur] = 1;
        }
        return acc;
    }, {});
    pipeline.push({ $project: project });
};
exports.projectionConfig = projectionConfig;
const sortPipelines = (pipeline) => {
    if (pipeline.length === 0)
        return pipeline;
    const matches = [];
    const project = [];
    const others = [];
    const addFields = [];
    const limit = [];
    const skip = [];
    const count = [];
    const sort = [];
    for (const stage of pipeline) {
        if (lodash_1.default.has(stage, '$match')) {
            matches.push(stage);
        }
        else if (lodash_1.default.has(stage, '$project')) {
            project.push(stage);
        }
        else if (lodash_1.default.has(stage, '$addFields')) {
            addFields.push(stage);
        }
        else if (lodash_1.default.has(stage, '$limit')) {
            limit.push(stage);
        }
        else if (lodash_1.default.has(stage, '$skip')) {
            skip.push(stage);
        }
        else if (lodash_1.default.has(stage, '$count')) {
            count.push(stage);
        }
        else if (lodash_1.default.has(stage, '$sort')) {
            sort.push(stage);
        }
        else {
            others.push(stage);
        }
    }
    return [
        ...others,
        ...matches,
        ...project,
        ...addFields,
        ...sort,
        ...skip,
        ...limit,
        ...count,
    ];
};
exports.sortPipelines = sortPipelines;
const deleteAllLookup = (pipeline) => {
    return pipeline.filter((stage) => !lodash_1.default.has(stage, '$lookup') &&
        !lodash_1.default.has(stage, '$unwind') &&
        !lodash_1.default.has(stage, '$addFields'));
};
exports.deleteAllLookup = deleteAllLookup;
//# sourceMappingURL=pipelines.utils.js.map