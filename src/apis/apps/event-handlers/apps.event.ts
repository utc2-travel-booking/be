import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_EVENT_HANDLER } from '../constants';
import { AppsService } from '../apps.service';
import { SumRatingAppModel } from '../models/sum-rating-app.model';

@Injectable()
export class AppEvent {
    private readonly logger = new Logger(AppEvent.name);
    constructor(private readonly appsService: AppsService) {}

    @OnEvent(APP_EVENT_HANDLER.ADD_RATING_FOR_USER)
    async handleSumTotalRating(sumRatingAppModel: SumRatingAppModel) {
        await this.appsService.sumTotalRating(sumRatingAppModel);
    }
}
