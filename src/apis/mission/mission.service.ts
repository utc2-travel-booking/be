import { HttpException, Injectable } from "@nestjs/common";
import axios from "axios";
import { UserPayload } from "src/base/models/user-payload.model";
import { UserService } from "../users/user.service";
import { Types } from 'mongoose';
import { AddPointMissionDto } from "../apps/models/add-point-for-user.model";
import { UserAppHistoriesService } from "../user-app-histories/user-app-histories.service";
import { AppsService } from "../apps/apps.service";
import { ActionType } from "../user-app-histories/constants";

@Injectable()
export class MissionService {
    constructor(
        private readonly userServices: UserService,
        private readonly appsServices: AppsService,
        private readonly userAppHistoriesService: UserAppHistoriesService
    ) { }

    async getMission() {
        try {
            const url = `${process.env.BASE_URL_MISSION_SYSTEM}/mission`
            const params = {
                apiKey: process.env.API_KEY_MISSION
            }
            const response = await axios.get(url, {
                params
            });
            return response.data;
        }
        catch (e) {
            throw new HttpException(e.message, 400)
        }
    }
    async checkMissionComplete() {
        try {
            const url = `${process.env.BASE_URL_MISSION_SYSTEM}/mission`
            const params = {
                apiKey: process.env.API_KEY_MISSION
            }
            const response = await axios.get(url, {
                params
            });
            return response.data;
        }
        catch (e) {
            throw new HttpException(e.message, 400)
        }
    }
    async verifyOpenApp(
        appId: Types.ObjectId,
        userPayload: UserPayload,
        action: ActionType
    ) {
        const { _id: userId } = userPayload;
        const app = await this.appsServices.getAppById(appId);
        console.log(app)
        if (!app) {
            throw new HttpException("AppId not Found", 400)
        }

        const isOpenNewApp = await this.userAppHistoriesService.createUserAppHistory(
            appId,
            userId,
            action
        );

        if (!isOpenNewApp) { return false }

        return true
    }

}