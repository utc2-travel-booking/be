import { FindMongooseModel } from 'src/base/models/find-mongoose.model';
import { findDocumentMultipleLanguage } from '../common/find.utils';
import _ from 'lodash';
import { appSettings } from 'src/configs/appsettings';
import { RequestContext } from 'src/packages/super-request-context';

export function FindWithMultipleLanguage() {
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

            const [option] = args;
            const { filterPipeline } = option as FindMongooseModel<any>;

            const pipeline = Array.isArray(filterPipeline)
                ? filterPipeline
                : [];

            findDocumentMultipleLanguage(this.entity, pipeline, locale);

            const updatedArgs = [
                {
                    ...option,
                    filterPipeline: pipeline,
                },
            ];
            return originalMethod.apply(this, updatedArgs);
        };

        return descriptor;
    };
}
