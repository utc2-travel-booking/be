import { updateDocumentMultipleLanguage } from '../common/update.utils';
import { appSettings } from 'src/configs/app-settings';
import _ from 'lodash';
import { RequestContext } from '@libs/super-request-context';

export function UpdateWithMultipleLanguage() {
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

            const query = _.get(req, 'query', {});
            const locale = _.get(query, 'locale', appSettings.mainLanguage);

            const [filter, update] = args;
            await updateDocumentMultipleLanguage(
                this.model,
                this.entity,
                filter,
                update,
                locale,
            );
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
