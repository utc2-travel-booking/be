import _ from 'lodash';
import crypto from 'crypto';

export const generateKey = (serialized: object) => {
    const orderObject = (obj: any): any => {
        if (_.isArray(obj)) {
            return obj.map(orderObject);
        } else if (_.isPlainObject(obj)) {
            return _(obj)
                .toPairs()
                .sortBy(0)
                .map(([k, v]) => [k, orderObject(v)])
                .fromPairs()
                .value();
        }
        return obj;
    };

    const ordered = orderObject(serialized);
    const jsonString = JSON.stringify(ordered);

    const hash = crypto.createHash('sha256');
    hash.update(jsonString);
    return hash.digest('hex');
};
