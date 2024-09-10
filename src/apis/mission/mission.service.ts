import { HttpException, Injectable } from "@nestjs/common";
import axios from "axios";
import { UserPayload } from "src/base/models/user-payload.model";
import { UserService } from "../users/user.service";
import { Types } from 'mongoose';
import { UserAppHistoriesService } from "../user-app-histories/user-app-histories.service";
import { AppsService } from "../apps/apps.service";
import { ActionType, EStatusTask } from "../user-app-histories/constants";
import { UserTransactionService } from "../user-transaction/user-transaction.service";
import { WebsocketGateway } from "src/packages/websocket/websocket.gateway";

@Injectable()
export class MissionService {
    constructor(
        private readonly userServices: UserService,
        private readonly appsServices: AppsService,
        private readonly userAppHistoriesService: UserAppHistoriesService,
        private readonly websocketGateway: WebsocketGateway,
        private readonly userTransactionService: UserTransactionService
    ) { }

    async getMission(user: UserPayload) {
        const { telegramUserId } = await this.userServices.getMe(user);
        try {
            const url = `${process.env.BASE_URL_MISSION_SYSTEM}/mission/${telegramUserId}/progress`
            const params = {
                limit: 50,
                apiKey: process.env.API_KEY_MISSION
            }
            const response = await axios.get(url, {
                params
            });
            const data = await Promise.all(response.data.data.map(async (item) => {
                if (!item.isCompleted) {
                    item.status = EStatusTask.IN_PROGRESS
                }
                else {
                    const history = await this.userTransactionService.getTransactionMeByMissionId(item.mission._id, user._id);
                    console.log(history)
                    if (history) {
                        item.status = EStatusTask.CLAIMED
                    }
                    else {
                        item.status = EStatusTask.COMPLETED
                    }
                }
                return item;
            }));

            return data;
        }
        catch (e) {
            throw new HttpException(e.message, 400)
        }
    }
    async updateMissionProcess(ids: string[], telegramId: string) {
        try {
            const url = `${process.env.BASE_URL_MISSION_SYSTEM}/mission/progress`
            const payload = {
                ids,
                telegramId,
                apiKey: process.env.API_KEY_MISSION
            }
            const res = await axios.put(
                url,
                payload
            )
            return res.data;
        }
        catch (e) {
            console.error(e.response)
            throw new HttpException(e.message, 400)
        }
    }

    async updateProgressActionApp(
        appId: Types.ObjectId,
        userPayload: UserPayload,
        action: ActionType
    ) {
        const { _id: userId } = userPayload;
        const user = await this.userServices.getMe(userPayload);
        const app = await this.appsServices.getAppById(appId);
        if (!app) {
            throw new HttpException("AppId not Found", 400)
        }

        const isOpenNewApp = await this.userAppHistoriesService.createUserAppHistory(
            appId,
            userId,
            action
        );

        if (!isOpenNewApp) { return false }

        const missionId = this.getMissionIdByType(action)

        await this.updateMissionProcess([missionId], user.telegramUserId.toString())
        this.websocketGateway.sendMissionUpdate(userId);
        return true
    }


    async claimMission(missionId: string, user: UserPayload) {
        const history = (await this.getMission(user)).find((item) => item._id == missionId);
        if (!history) {
            throw new HttpException("Mission not Found", 400)
        }
        if (history.status === EStatusTask.CLAIMED) {
            throw new HttpException("Mission has already been claimed", 400)
        }
        if (history.status === EStatusTask.IN_PROGRESS) {
            throw new HttpException("Mission is currently in progress", 400)
        }
        if (history.status === EStatusTask.COMPLETED) {
            await this.userServices.addPointUserCompletedMission(user, history.mission)
        }
        return true;
    }

    getMissionIdByType(action: ActionType) {
        switch (action) {
            case ActionType.OPEN_APP:
                return process.env.MISSION_ID_OPEN_APP;
            case ActionType.COMMENT_APP:
                return process.env.MISSION_ID_REVIEW_APP;
            case ActionType.SHARE_APP:
                return process.env.MISSION_ID_SHARE_APP;
            default:
                return process.env.MISSION_ID_OPEN_APP
        }
    }



}