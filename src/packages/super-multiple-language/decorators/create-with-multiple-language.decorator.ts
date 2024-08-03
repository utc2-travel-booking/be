import { RequestContext } from 'nestjs-request-context';
import { createDocumentMultipleLanguage } from '../common/create.utils';
import _ from 'lodash';
import { appSettings } from 'src/configs/appsettings';

export function CreateWithMultipleLanguage() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const req: Request = _.get(
                RequestContext,
                'currentContext.req',
                null,
            );

            if (!req) {
                return originalMethod.apply(this, args);
            }

            const query = _.isEmpty(req['query']) ? {} : req['query'];
            const locale = _.get(query, 'locale', appSettings.mainLanguage);
            const [doc] = args;

            await createDocumentMultipleLanguage(
                this.entity,
                doc,
                locale,
                Array.isArray(doc),
            );
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
