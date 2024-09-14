import _ from 'lodash';

export const handlerInAndNotInOperator = (search: any, key: string) => {
    const values = search[key].split(',');

    if (values.length === 0) {
        throw new Error(
            'Invalid search query value. Please provide at least one value',
        );
    }

    for (let i = 0; i < values.length; i++) {
        if (Number(values[i])) {
            values[i] = Number(values[i]);
        }

        if (_.isString(values[i])) {
            values[i] = values[i].replace(/%3C/g, '<');
        }
    }

    return values;
};
