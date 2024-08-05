import _ from 'lodash';
import { PipelineStage, ProjectionType } from 'mongoose';

export const projectionConfig = (
    pipeline: PipelineStage[],
    projection?: ProjectionType<any> | null,
) => {
    const projections = projection.toString().split(' ');

    const project = projections.reduce((acc, cur) => {
        const _cur = cur.split('-');
        if (_cur.length > 1) {
            acc[_cur[1]] = 0;
        } else {
            acc[cur] = 1;
        }

        return acc;
    }, {});

    pipeline.push({ $project: project });
};

// match stay first in the pipeline not working with $lookup
export const moveMatchesToEnd = (
    pipeline: PipelineStage[],
): PipelineStage[] => {
    if (pipeline.length === 0) return pipeline;

    const matches: PipelineStage[] = [];
    const project: PipelineStage[] = [];
    const others: PipelineStage[] = [];
    const addFields: PipelineStage[] = [];

    for (const stage of pipeline) {
        if (_.has(stage, '$match')) {
            matches.push(stage);
        } else if (_.has(stage, '$project')) {
            project.push(stage);
        } else if (_.has(stage, '$addFields')) {
            addFields.push(stage);
        } else {
            others.push(stage);
        }
    }

    return [...others, ...matches, ...project, ...addFields];
};
