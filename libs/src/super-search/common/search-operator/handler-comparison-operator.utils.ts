import _ from 'lodash';

export const handlerComparisonOperator = (search: any, key: string) => {
    if (_.isDate(search[key])) {
        return new Date(search[key]);
    }

    if (_.isNumber(search[key])) {
        return Number(search[key]);
    }

    throw new Error(
        'Invalid search query value. BTW just support for Date and Number',
    );
};
