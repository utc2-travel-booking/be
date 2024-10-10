import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Connection } from 'mongoose';

interface IsExistOptions {
    collectionName: string;
    isArray?: boolean;
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async validate(value: any, args: ValidationArguments) {
        if (!value) return false;
        const [options] = args.constraints as IsExistOptions[];
        const { collectionName, isArray = false } = options;

        try {
            const collection = this.connection.collection(collectionName);
            const query = isArray ? { _id: { $in: value } } : { _id: value };
            const result = await collection.countDocuments(query);

            return isArray ? result === value.length : result > 0;
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} does not exist`;
    }
}

export function IsExist(options: IsExistOptions & ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: options,
            constraints: [options],
            validator: IsExistConstraint,
        });
    };
}
