import { applyDecorators, Controller } from '@nestjs/common';

export const SuperController = (prefix?: string | string[]) => {
    return applyDecorators(Controller(prefix));
};
