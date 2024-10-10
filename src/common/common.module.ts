import { Module } from '@nestjs/common';
import { IsExistConstraint } from './services/is-exist-constraint.service';

@Module({
    imports: [],
    controllers: [],
    providers: [IsExistConstraint],
    exports: [IsExistConstraint],
})
export class CommonModule {}
