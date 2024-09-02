import { ExtendedApiProperty } from '@libs/super-core/decorators/extended-api-property.decorator';

export class UploadMediaDto {
    @ExtendedApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
