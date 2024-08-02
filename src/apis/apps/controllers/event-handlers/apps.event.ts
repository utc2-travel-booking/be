import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_EVENT_HANDLER } from '../../../users/constants';
import { SumRatingAppModel } from '../../models/sum-rating-app.model';
import { AppsService } from '../../apps.service';

@Injectable()
export class AppEvent {
    private readonly logger = new Logger(AppEvent.name);
    constructor(private readonly appsService: AppsService) {}

    @OnEvent(USER_EVENT_HANDLER.ADD_RATING_FOR_USER)
    async handleSumTotalRating(sumRatingAppModel: SumRatingAppModel) {
        console.log('sumRatingModel', sumRatingAppModel);
        await this.appsService.sumTotalRating(sumRatingAppModel);
    }
}
