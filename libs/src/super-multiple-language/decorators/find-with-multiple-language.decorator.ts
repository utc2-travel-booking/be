import { RequestContext } from '@libs/super-request-context';
import { findDocumentMultipleLanguage } from '../common/find.utils';
import _ from 'lodash';
import { appSettings } from 'src/configs/app-settings';

export function FindWithMultipleLanguage() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const req: Request = _.get(
                RequestContext,
                'currentContext.req',
                null,
            );

            if (!req) {
                return originalMethod.apply(this, args);
            }

            const query = _.get(req, 'query', {});
            const locale = _.get(query, 'locale', appSettings.mainLanguage);

            const [filter, pipeline] = args;

            const _pipeline = findDocumentMultipleLanguage(this.entity, locale);

            const updatedArgs = [filter, [..._pipeline, ...(pipeline || [])]];

            try {
                const result = originalMethod.apply(this, updatedArgs);
                return result;
            } catch (error) {
                throw error;
            }
        };

        return descriptor;
    };
}
