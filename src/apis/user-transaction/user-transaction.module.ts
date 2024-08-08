import { forwardRef, Module } from '@nestjs/common';
import { UserTransactionService } from './user-transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserTransactionSchema } from './entities/user-transaction.entity';
import { UserModule } from '../users/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER_TRANSACTION,
                schema: UserTransactionSchema,
            },
        ]),
        forwardRef(() => UserModule),
    ],
    controllers: [],
    providers: [UserTransactionService],
    exports: [UserTransactionService],
})
export class UserTransactionModule {}
