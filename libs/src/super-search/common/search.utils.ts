import { UnprocessableEntityException } from '@nestjs/common';
import _ from 'lodash';
import { PipelineStage, Types } from 'mongoose';
import { OPERATOR, SearchType } from '../constants';
import {
    handlerBetweenOperator,
    handlerComparisonOperator,
    handlerInAndNotInOperator,
} from '.';

export const createSearchPipeline = (search: any, searchType: string) => {
    if (!_.isObjectLike(search)) {
        return [];
    }
    const keys = Object.keys(search);
    const result = keys
        .map((key) => {
            const [field, operator] = key.split(':');

            if (!operator) {
                throw new UnprocessableEntityException(
                    'Invalid search query operator',
                );
            }

            if (!field) {
                throw new UnprocessableEntityException(
                    'Invalid search query search by',
                );
            }

            if (!search[key]) {
                return null;
            }

            if (_.upperCase(operator) === OPERATOR.BETWEEN) {
                return {
                    field,
                    operator,
                    value: handlerBetweenOperator(search, key),
                };
            }

            if (
                [OPERATOR.IN, OPERATOR.NOT_IN].includes(
                    operator.toUpperCase() as OPERATOR,
                )
            ) {
                return {
                    field,
                    operator,
                    value: handlerInAndNotInOperator(search, key),
                };
            }

            if (
                [
                    OPERATOR.BEFORE,
                    OPERATOR.AFTER,
                    OPERATOR.IS_AND_BEFORE,
                    OPERATOR.IS_AND_AFTER,
                ].includes(operator.toUpperCase() as OPERATOR)
            ) {
                return {
                    field,
                    operator,
                    value: handlerComparisonOperator(search, key),
                };
            }

            return {
                field,
                operator,
                value: Number(search[key]) ? Number(search[key]) : search[key],
            };
        })
        .filter((item) => item);

    const pipeline: PipelineStage[] = [];

    result.forEach((item) => {
        const { field, operator, value } = item;
        addSearchConditionToPipeline(
            pipeline,
            operator,
            field,
            value,
            searchType,
        );
    });

    return pipeline;
};

export const addSearchConditionToPipeline = (
    pipeline: any[],
    operator: string,
    searchBy: string,
    keyword: any,
    searchType: string,
) => {
    operator = operator.toUpperCase();
    keyword = transformKeyword(keyword);

    const matchStage: any = {};

    switch (operator) {
        case OPERATOR.LIKE:
            const words = _.words(keyword);
            const regexPattern = words.map(_.escapeRegExp).join('.*');
            matchStage[searchBy] = {
                $regex: new RegExp(regexPattern, 'i'),
            };
            break;
        case OPERATOR.NOT_LIKE:
            matchStage[searchBy] = {
                $not: {
                    $regex: _.escapeRegExp(String(keyword)),
                    $options: 'i',
                },
            };
            break;
        case OPERATOR.IN:
            matchStage[searchBy] = { $in: keyword };
            break;
        case OPERATOR.NOT_IN:
            matchStage[searchBy] = { $nin: keyword };
            break;
        case OPERATOR.BETWEEN:
            const { from, to } = keyword as any;
            matchStage[searchBy] = { $gte: from, $lte: to };
            break;
        case OPERATOR.BEFORE:
            matchStage[searchBy] = {
                $lt: _.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case OPERATOR.IS_AND_BEFORE:
            matchStage[searchBy] = {
                $lte: _.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case OPERATOR.AFTER:
            matchStage[searchBy] = {
                $gt: _.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case OPERATOR.IS_AND_AFTER:
            matchStage[searchBy] = {
                $gte: _.isDate(keyword) ? new Date(keyword) : parseInt(keyword),
            };
            break;
        case OPERATOR.ISNULL:
            matchStage[searchBy] = { $exists: keyword };
            break;
        case OPERATOR.NOT:
            matchStage[searchBy] = { $ne: keyword };
            break;
        case OPERATOR.IS:
            matchStage[searchBy] = keyword;
            break;
        case OPERATOR.IS_EMPTY:
            if (keyword === true) {
                matchStage[searchBy] = {
                    $exists: true,
                    $in: [null, '', [] as any],
                };
            } else {
                matchStage[searchBy] = { $nin: [null, '', [] as any] };
            }
            break;
        default:
            break;
    }

    if (searchType.toLocaleUpperCase() === SearchType.AND) {
        if (_.get(pipeline, '[0].$match.$and')) {
            pipeline[0].$match.$and.push(matchStage);
        } else {
            pipeline.push({ $match: { $and: [matchStage] } });
        }
    } else if (searchType.toLocaleUpperCase() === SearchType.OR) {
        if (_.get(pipeline, '[0].$match.$or')) {
            pipeline[0].$match.$or.push(matchStage);
        } else {
            pipeline.push({ $match: { $or: [matchStage] } });
        }
    }
};

const transformKeyword = (keyword: any) => {
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
        return Types.ObjectId.isValid(keyword)
            ? new Types.ObjectId(keyword)
            : keyword;
    }

    if (Array.isArray(keyword)) {
        return keyword.map((item) => transformKeyword(item));
    }

    return keyword;
};
