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
