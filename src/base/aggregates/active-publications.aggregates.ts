import dayjs from 'dayjs';
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

    if (filterPipeline[0]['$match']['$or']) {
        filterPipeline[0]['$match']['$or'].push(...pipelines);
    } else {
        filterPipeline[0]['$match']['$or'] = pipelines;
    }
};
