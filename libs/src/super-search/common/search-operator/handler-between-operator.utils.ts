import { UnprocessableEntityException } from '@nestjs/common';
import _ from 'lodash';

export const handlerBetweenOperator = (search: any, key: string) => {
    const [from, to] = search[key].split(',');
    if (!from || !to) {
        throw new UnprocessableEntityException(
            'Invalid search query value. Please provide both from and to value',
        );
    }

    if (!isNaN(Date.parse(from)) && !isNaN(Date.parse(to))) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate.toDateString() === toDate.toDateString()) {
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);
        }

        return { from: fromDate, to: toDate };
    }

    const fromNumber = Number(from);
    const toNumber = Number(to);

    if (
        _.isNumber(fromNumber) &&
        !isNaN(fromNumber) &&
        _.isNumber(toNumber) &&
        !isNaN(toNumber)
    ) {
        return { from: fromNumber, to: toNumber };
    }

    throw new UnprocessableEntityException(
        'Invalid search query value. BTW just support for Date and Number',
    );
};
