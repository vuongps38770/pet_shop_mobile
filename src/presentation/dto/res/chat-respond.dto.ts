export interface ConversationRespondDto {
    _id: string;
    type: 'shop' | string;
    participants: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface MessageRespondDto {
    _id: string;
    conversationId: string;
    sender: string;
    content: string;
    readList: string[];
    createdAt: Date;
    updatedAt: Date;
    isEdited: boolean;
    images?: string[];
    orderId?:string
}