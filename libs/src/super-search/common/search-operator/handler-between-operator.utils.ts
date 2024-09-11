import { UnprocessableEntityException } from '@nestjs/common';
import _ from 'lodash';

export const handlerBetweenOperator = (search: any, key: string) => {
    const [from, to] = search[key].split(',');
    if (!from || !to) {
        throw new UnprocessableEntityException(
            'Invalid search query value. Please provide both from and to value',
        );
    }

    if (_.isDate(from) && _.isDate(to)) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate.toDateString() === toDate.toDateString()) {
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);
        }

        return { from: fromDate, to: toDate };
    }

    if (_.isNumber(from) && _.isNumber(to)) {
        return { from: Number(from), to: Number(to) };
    }

    throw new UnprocessableEntityException(
        'Invalid search query value. BTW just support for Date and Number',
    );
};
