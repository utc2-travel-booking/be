import { forwardRef, Module } from '@nestjs/common';
import { UserTransactionService } from './user-transaction.service';
import { COLLECTION_NAMES } from 'src/constants';
import {
    UserTransaction,
    UserTransactionSchema,
} from './entities/user-transaction.entity';
import { UserModule } from '../users/user.module';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER_TRANSACTION,
                schema: UserTransactionSchema,
                entity: UserTransaction,
            },
        ]),
        forwardRef(() => UserModule),
    ],
    controllers: [],
    providers: [UserTransactionService],
    exports: [UserTransactionService],
})
export class UserTransactionModule {}
