export interface Card {
    cardId: string;
    status: 'new' | 'bound' | 'expired';
    vehicleNumber?: string;
    chassisNumber?: string;
    expiryDate?: Date;
    points?: number;
}

export interface CardBinding {
    vehicleNumber: string;
    chassisNumber: string;
    expiryDate: Date;
}