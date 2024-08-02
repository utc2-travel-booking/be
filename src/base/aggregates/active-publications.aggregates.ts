import dayjs from 'dayjs';
import _ from 'lodash';
import { PipelineStage } from 'mongoose';

export const activePublications = (filterPipeline: PipelineStage[]) => {
    const currentDate = dayjs().toDate();

    const pipelines = [
        {
            $and: [
                {
                    published_start: {
                        $lte: currentDate,
                    },
                },
                {
                    published_end: {
                        $gte: currentDate,
                    },
                },
            ],
        },
        {
            $and: [
                {
                    published_start: {
                        $lte: currentDate,
                    },
                },
                {
                    published_end: null,
                },
            ],
        },
        {
            $and: [
                {
                    published_start: null,
                },
                {
                    published_end: null,
                },
            ],
        },
    ];

    const orPipelines = _.get(filterPipeline, '[0].$match.$or', []);

    if (!orPipelines) {
        _.set(filterPipeline, '[0].$match.$or', [...pipelines]);
        return;
    }

    orPipelines.push(...pipelines);
};
