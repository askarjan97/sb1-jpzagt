import { Card, CardBinding } from '../models/card.model';
import { NFCService } from './nfc.service';
import { alert } from '@nativescript/core';

export class CardService {
    private nfcService: NFCService;

    constructor() {
        this.nfcService = new NFCService();
    }

    async bindCard(cardId: string, binding: CardBinding): Promise<void> {
        try {
            const isValid = await this.nfcService.verifyCard(cardId);
            if (!isValid) {
                throw new Error('无效的卡片');
            }

            const cardData: Card = {
                cardId,
                status: 'bound',
                ...binding,
                points: 0
            };

            await this.nfcService.writeCard(cardData);
            alert({
                title: "绑定成功",
                message: "卡片已成功绑定到车辆",
                okButtonText: "确定"
            });
        } catch (error) {
            alert({
                title: "绑定失败",
                message: error.message,
                okButtonText: "确定"
            });
            throw error;
        }
    }

    async checkCard(cardId: string): Promise<Card> {
        try {
            const tag = await this.nfcService.readCard();
            const data: Card = JSON.parse(tag.textRecords[0].text);
            
            if (data.cardId !== cardId) {
                throw new Error('卡片ID不匹配');
            }

            if (data.status === 'expired') {
                throw new Error('卡片已过期');
            }

            // 增加积分
            data.points = (data.points || 0) + 10;
            await this.nfcService.writeCard(data);

            return data;
        } catch (error) {
            alert({
                title: "检查失败",
                message: error.message,
                okButtonText: "确定"
            });
            throw error;
        }
    }

    async exchangePoints(cardId: string, points: number): Promise<number> {
        try {
            const tag = await this.nfcService.readCard();
            const data: Card = JSON.parse(tag.textRecords[0].text);
            
            if (data.cardId !== cardId) {
                throw new Error('卡片ID不匹配');
            }

            if ((data.points || 0) < points) {
                throw new Error('积分不足');
            }

            data.points -= points;
            await this.nfcService.writeCard(data);

            return data.points;
        } catch (error) {
            alert({
                title: "兑换失败",
                message: error.message,
                okButtonText: "确定"
            });
            throw error;
        }
    }
}