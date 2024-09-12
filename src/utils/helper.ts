import { BadGatewayException } from '@nestjs/common';
import { Types } from 'mongoose';

export const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const convertStringToObjectId = (value: any, isArray = false) => {
    if (!value) {
        return null;
    }

    if (isArray) {
        return value.map((val) => {
            const trimmedVal = val.trim();
            if (!Types.ObjectId.isValid(trimmedVal)) {
                throw new BadGatewayException(
                    `Invalid ObjectId: ${trimmedVal}`,
                );
            }

            return new Types.ObjectId(trimmedVal);
        });
    }

    if (!Types.ObjectId.isValid(value)) {
        throw new BadGatewayException(`Invalid ObjectId: ${value}`);
    }

    return new Types.ObjectId(value);
};
export const resetMissionTime = () => {
    return new Date().setHours(0, 0, 0, 0);
};
export const compareWithToday = (dateFromApi: string): boolean => {
    const today = new Date();
    const apiDate = new Date(dateFromApi);

    const isSameDay =
        apiDate.getUTCFullYear() === today.getUTCFullYear() &&
        apiDate.getUTCMonth() === today.getUTCMonth() &&
        apiDate.getUTCDate() === today.getUTCDate();

    return isSameDay;
};
export const compareToday = (dateFromApi: Date): boolean => {
    const today = new Date();
    const isSameDay =
        dateFromApi.getUTCFullYear() === today.getUTCFullYear() &&
        dateFromApi.getUTCMonth() === today.getUTCMonth() &&
        dateFromApi.getUTCDate() === today.getUTCDate();

    return isSameDay;
};

export const hasOneHourPassed = (timestamp: Date): boolean => {
    const now = new Date();
    timestamp.setHours(timestamp.getHours() + 1);
    return now >= timestamp;
};
