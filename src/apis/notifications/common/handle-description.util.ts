import { NOTIFICATION_TYPE } from '../constants/index';

const patterns = [
    {
        key: NOTIFICATION_TYPE.COMPLETED,
        regex: /You have completed the task of (.+)/,
        paramNames: ['missionName'],
    },
    {
        key: NOTIFICATION_TYPE.LIMIT,
        regex: /You (\d+) today - max reached!/,
        paramNames: ['limitReward'],
    },
    {
        key: NOTIFICATION_TYPE.OPEN,
        regex: /You open (.+)/,
        paramNames: ['appName'],
    },
    {
        key: NOTIFICATION_TYPE.COMMENT,
        regex: /You comment (.+)/,
        paramNames: ['appName'],
    },
    {
        key: NOTIFICATION_TYPE.SHARE,
        regex: /You share (.+)/,
        paramNames: ['appName'],
    },
];

export const parseDescription = (tempDescription: string) => {
    for (const pattern of patterns) {
        const match = tempDescription.match(pattern.regex);
        if (match) {
            const params: { [key: string]: string } = {};
            pattern.paramNames.forEach((paramName, index) => {
                params[paramName] = match[index + 1];
            });
            return {
                key: pattern.key,
                param: params,
            };
        }
    }
    return null;
};
