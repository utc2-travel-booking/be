import _ from 'lodash';

export const handlerComparisonOperator = (search: any, key: string) => {
    if (!isNaN(Date.parse(search[key]))) {
        return new Date(search[key]);
    }

    if (_.isNumber(Number(search[key])) && !isNaN(Number(search[key]))) {
        return Number(search[key]);
    }

    throw new Error(
        'Invalid search query value. BTW just support for Date and Number',
    );
};
