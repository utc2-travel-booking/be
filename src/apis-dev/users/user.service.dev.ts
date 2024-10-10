import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TruncateAllInfoUserDto } from './dto/truncate-all-info-user.dto';
import _ from 'lodash';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';

@Injectable()
export class UserServiceDev {
    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly superCacheService: SuperCacheService,
    ) {}

    async truncateAllInfoUser(truncateAllInfoUserDto: TruncateAllInfoUserDto) {
        const { users, telegramUserIds } = truncateAllInfoUserDto;
        const collectionNames = Object.values(COLLECTION_NAMES);

        if (users && _.size(users) > 0) {
            for (const userId of users) {
                for (const collectionName of collectionNames) {
                    const collection =
                        this.connection.collection(collectionName);

                    await collection.deleteMany({
                        $or: [
                            { _id: userId },
                            { createdBy: userId },
                            { user: userId },
                        ],
                    });
                }
            }
        }

        if (telegramUserIds && _.size(telegramUserIds) > 0) {
            for (const telegramUserId of telegramUserIds) {
                const user = await this.connection
                    .collection(COLLECTION_NAMES.USER)
                    .findOne({ telegramUserId });
                if (!user) {
                    continue;
                }
                for (const collectionName of collectionNames) {
                    const collection =
                        this.connection.collection(collectionName);

                    await collection.deleteMany({
                        $or: [
                            { _id: user._id },
                            { createdBy: user._id },
                            { user: user._id },
                        ],
                    });
                }
            }
        }

        await this.superCacheService.resetCache();
    }
}
