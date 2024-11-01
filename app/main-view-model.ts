import { Observable } from '@nativescript/core';
import { NFCService } from './services/nfc.service';
import { CardService } from './services/card.service';
import { Card, CardBinding } from './models/card.model';

export class MainViewModel extends Observable {
    private nfcService: NFCService;
    private cardService: CardService;
    
    private _selectedTab: number = 0;
    private _cardId: string = '';
    private _vehicleNumber: string = '';
    private _chassisNumber: string = '';
    private _expiryDate: string = '';
    private _cardList: Array<Card> = [];
    private _currentPoints: number = 0;
    private _exchangePoints: number = 0;

    constructor() {
        super();
        this.nfcService = new NFCService();
        this.cardService = new CardService();
        this.initializeNFC();
    }

    private async initializeNFC() {
        try {
            await this.nfcService.initialize();
        } catch (error) {
            console.error('NFC initialization failed:', error);
        }
    }

    // Getters and setters for properties
    get selectedTab(): number {
        return this._selectedTab;
    }

    set selectedTab(value: number) {
        if (this._selectedTab !== value) {
            this._selectedTab = value;
            this.notifyPropertyChange('selectedTab', value);
        }
    }

    get cardId(): string {
        return this._cardId;
    }

    set cardId(value: string) {
        if (this._cardId !== value) {
            this._cardId = value;
            this.notifyPropertyChange('cardId', value);
        }
    }

    get vehicleNumber(): string {
        return this._vehicleNumber;
    }

    set vehicleNumber(value: string) {
        if (this._vehicleNumber !== value) {
            this._vehicleNumber = value;
            this.notifyPropertyChange('vehicleNumber', value);
        }
    }

    get chassisNumber(): string {
        return this._chassisNumber;
    }

    set chassisNumber(value: string) {
        if (this._chassisNumber !== value) {
            this._chassisNumber = value;
            this.notifyPropertyChange('chassisNumber', value);
        }
    }

    get expiryDate(): string {
        return this._expiryDate;
    }

    set expiryDate(value: string) {
        if (this._expiryDate !== value) {
            this._expiryDate = value;
            this.notifyPropertyChange('expiryDate', value);
        }
    }

    get cardList(): Array<Card> {
        return this._cardList;
    }

    get currentPoints(): number {
        return this._currentPoints;
    }

    get exchangePoints(): number {
        return this._exchangePoints;
    }

    set exchangePoints(value: number) {
        if (this._exchangePoints !== value) {
            this._exchangePoints = value;
            this.notifyPropertyChange('exchangePoints', value);
        }
    }

    // Card operations
    async readEmptyCard() {
        try {
            const cardData = await this.nfcService.readCard();
            console.log('Card data:', cardData);
        } catch (error) {
            console.error('Read card failed:', error);
        }
    }

    async createNewCard() {
        try {
            const newCard: Card = {
                cardId: this.generateCardId(),
                status: 'new',
                points: 0
            };
            await this.nfcService.writeCard(newCard);
            this._cardList.push(newCard);
            this.notifyPropertyChange('cardList', this._cardList);
        } catch (error) {
            console.error('Create card failed:', error);
        }
    }

    async bindCard() {
        try {
            const binding: CardBinding = {
                vehicleNumber: this.vehicleNumber,
                chassisNumber: this.chassisNumber,
                expiryDate: new Date(this.expiryDate)
            };
            await this.cardService.bindCard(this.cardId, binding);
        } catch (error) {
            console.error('Bind card failed:', error);
        }
    }

    async checkCard() {
        try {
            const card = await this.cardService.checkCard(this.cardId);
            this._currentPoints = card.points || 0;
            this.notifyPropertyChange('currentPoints', this._currentPoints);
        } catch (error) {
            console.error('Check card failed:', error);
        }
    }

    async exchangePointsAction() {
        try {
            const remainingPoints = await this.cardService.exchangePoints(
                this.cardId,
                this.exchangePoints
            );
            this._currentPoints = remainingPoints;
            this.notifyPropertyChange('currentPoints', this._currentPoints);
            this.exchangePoints = 0;
        } catch (error) {
            console.error('Exchange points failed:', error);
        }
    }

    private generateCardId(): string {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}