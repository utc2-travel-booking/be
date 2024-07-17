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
