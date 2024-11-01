import { getNFCAvailable, startNFCSession, NFCNdefData, writeTag, readTag } from '@nativescript-community/nfc';
import { alert } from '@nativescript/core';

export class NFCService {
    private nfcSession: any;

    async initialize(): Promise<void> {
        try {
            const isAvailable = await getNFCAvailable();
            if (!isAvailable) {
                throw new Error('NFC is not available on this device');
            }
            this.nfcSession = await startNFCSession();
        } catch (error) {
            throw new Error(`NFC initialization failed: ${error.message}`);
        }
    }

    async readCard(): Promise<NFCNdefData> {
        try {
            const tag = await readTag();
            return tag;
        } catch (error) {
            alert({
                title: "读卡错误",
                message: error.message,
                okButtonText: "确定"
            });
            throw error;
        }
    }

    async writeCard(data: any): Promise<void> {
        try {
            await writeTag({
                textRecords: [{
                    id: data.cardId,
                    text: JSON.stringify(data)
                }]
            });
            alert({
                title: "写卡成功",
                message: "卡片数据已成功写入",
                okButtonText: "确定"
            });
        } catch (error) {
            alert({
                title: "写卡错误",
                message: error.message,
                okButtonText: "确定"
            });
            throw error;
        }
    }

    async verifyCard(cardId: string): Promise<boolean> {
        try {
            const tag = await this.readCard();
            const data = JSON.parse(tag.textRecords[0].text);
            return data.cardId === cardId;
        } catch (error) {
            return false;
        }
    }
}