import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { appSettings } from "src/configs/appsettings";
import { WebsocketGateway } from "src/packages/websocket/websocket.gateway";
import { compareToday, hasOneHourPassed } from "src/utils/helper";
import { AppsService } from "../apps/apps.service";
import { ActionType, EMissionType, ESocialMedia, EStatusTask } from "../user-app-histories/constants";
import { UserAppHistoriesService } from "../user-app-histories/user-app-histories.service";
import { UserTransactionService } from "../user-transaction/user-transaction.service";
import { UserDocument } from "../users/entities/user.entity";
import { UserService } from '../users/user.service';

@Injectable()
export class MissionService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userServices: UserService,
        @Inject(forwardRef(() => AppsService))
        private readonly appsServices: AppsService,
        private readonly userAppHistoriesService: UserAppHistoriesService,
        private readonly websocketGateway: WebsocketGateway,
        private readonly userTransactionService: UserTransactionService,
    ) { }

    async getMission(user: UserPayload) {
        const { telegramUserId } = await this.userServices.getMe(user);
        if (telegramUserId) {
            await this.updateMissionProcess(
                [appSettings.mission.missionId.dailyLoginId],
                telegramUserId.toString(),
            );
        }
        try {
            const url = `${appSettings.mission.baseUrl}/mission/${telegramUserId}/progress`;
            const params = {
                limit: 50,
                apiKey: appSettings.mission.apiKeyMission,
            };
            const response = await axios.get(url, {
                params,
            });
            const data = await Promise.all(response.data.data.map(async (item) => {
                if (!item.isCompleted) {
                    item.status = EStatusTask.IN_PROGRESS
                }
                else {
                    const history = await this.userTransactionService.getTransactionMeByMissionId(item.mission._id, user._id);
                    if (history) {
                        if (item.mission.type === EMissionType.Daily) {
                            if (compareToday(history.updatedAt)) {
                                item.status = EStatusTask.CLAIMED
                            }
                            else {
                                item.status = EStatusTask.COMPLETED
                            }
                        }
                        else {
                            item.status = EStatusTask.CLAIMED
                        }
                    }
                    else {
                        if (item.mission.type === EMissionType.OPEN_LINK) {
                            if (hasOneHourPassed(item.updatedAt)) {
                                item.status = EStatusTask.COMPLETED
                            }
                            else {
                                item.status = EStatusTask.WAITING
                            }
                        }
                        else {
                            item.status = EStatusTask.COMPLETED
                        }
                    }
                }
                return item;
            }));

            return data;
        } catch (e) {
            throw new HttpException(e.message, 400);
        }
    }
    async updateMissionProcess(ids: string[], telegramId: string) {
        try {
            const url = `${appSettings.mission.baseUrl}/mission/progress`;
            const payload = {
                ids,
                telegramId,
                apiKey: appSettings.mission.apiKeyMission,
            };
            const res = await axios.put(url, payload);
            return res.data;
        } catch (e) {
            throw new HttpException(e.response.data, 400);
        }
    }

    async updateProgressSocial(userPayload: UserPayload, type: ESocialMedia) {
        const user = await this.userServices.getMe(userPayload);
        const missionId = this.getMissionIdByType(type)
        await this.updateMissionProcess([missionId], user.telegramUserId.toString())
        return true
    }

    async updateProgressActionApp(
        appId: Types.ObjectId,
        userPayload: UserPayload,
        action: ActionType,
    ) {
        const { _id: userId } = userPayload;
        const user = await this.userServices.getMe(userPayload);
        const app = await this.appsServices.getAppById(appId);
        if (!app) {
            throw new HttpException('AppId not Found', 400);
        }

        const history = await this.userAppHistoriesService.createUserAppHistory(
            appId,
            userId,
            action,
        );

        if (!history) {
            return false;
        }

        const missionId = this.getMissionIdByType(action);

        await this.updateMissionProcess(
            [missionId],
            user.telegramUserId.toString(),
        );
        this.websocketGateway.sendMissionUpdate(userId);
        return true;
    }

    async claimMission(missionId: string, user: UserPayload) {
        const history = (await this.getMission(user)).find(
            (item) => item._id == missionId,
        );
        if (!history) {
            throw new HttpException('Mission not Found', 400);
        }
        if (history.status === EStatusTask.CLAIMED) {
            throw new HttpException('Mission has already been claimed', 400);
        }
        if (history.status === EStatusTask.IN_PROGRESS) {
            throw new HttpException('Mission is currently in progress', 400);
        }
        if (history.status === EStatusTask.COMPLETED) {
            return await this.userServices.addPointUserCompletedMission(user, history.mission)
        }
        return true;
    }

    async updateMissionReferral(user: UserDocument) {
        const missionReferral = [
            appSettings.mission.missionId.firstInviteId,
            appSettings.mission.missionId.growingCircleId,
            appSettings.mission.missionId.friendGrathererId,
            appSettings.mission.missionId.communityBuilderId,
        ];
        await this.updateMissionProcess(
            missionReferral,
            user.telegramUserId.toString(),
        );
        this.websocketGateway.sendMissionUpdate(user._id);
        return true;
    }

    getMissionIdByType(action: ActionType | ESocialMedia) {
        switch (action) {
            case ActionType.OPEN_APP:
                return appSettings.mission.missionId.openAppId;
            case ActionType.COMMENT_APP:
                return appSettings.mission.missionId.reviewAppId;
            case ActionType.SHARE_APP:
                return appSettings.mission.missionId.shareAppId;
            case ESocialMedia.FACEBOOK:
                return appSettings.mission.missionId.followFBId;
            case ESocialMedia.X:
                return appSettings.mission.missionId.followXId;
            case ESocialMedia.TELEGRAM:
                return appSettings.mission.missionId.joinTelegramId;
            default:
                return appSettings.mission.missionId.openAppId;
        }
    }


}
