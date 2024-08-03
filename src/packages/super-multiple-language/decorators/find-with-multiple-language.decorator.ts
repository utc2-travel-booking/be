import { FindMongooseModel } from 'src/base/models/find-mongoose.model';
import { findDocumentMultipleLanguage } from '../common/find.utils';
import { RequestContext } from 'nestjs-request-context';
import _ from 'lodash';
import { appSettings } from 'src/configs/appsettings';

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

            const query = _.isEmpty(req['query']) ? {} : req['query'];
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
