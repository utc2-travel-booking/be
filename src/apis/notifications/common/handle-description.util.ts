import { NOTIFICATION_TYPE } from '../constants/index';

const patterns = [
    {
        key: NOTIFICATION_TYPE.COMPLETED,
        regex: /You have completed the task of (.+)/,
    },
    {
        key: NOTIFICATION_TYPE.LIMIT,
        regex: /You (\d+) today - max reached!/,
    },
    {
        key: NOTIFICATION_TYPE.OPEN,
        regex: /You open (.+)/,
    },
    {
        key: NOTIFICATION_TYPE.COMMENT,
        regex: /You comment (.+)/,
    },
    {
        key: NOTIFICATION_TYPE.SHARE,
        regex: /You share (.+)/,
    },
];

export const parseDescription = (tempDescription: string) => {
    for (const pattern of patterns) {
        const match = tempDescription.match(pattern.regex);
        if (match) {
            return {
                key: pattern.key,
                param1: match[1],
            };
        }
    }
    return null;
};
