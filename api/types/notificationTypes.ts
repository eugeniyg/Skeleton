export interface IMessageContent extends Record<string, any> {
  title: string;
  body: string;
  link?: {
    url: string;
    label: string;
  };
  image?: string;
}

export interface IMessage extends Record<string, any> {
  id: string;
  playerId: string;
  state: number;
  content: IMessageContent;
  readAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface INotificationsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
}

export interface INotificationsResponse extends Record<string, any> {
  data: IMessage[];
  meta: {
    page: number;
    perPage: number;
    totalPages: number;
    totalRows: number;
    totalUnread: number;
  };
}

export interface IMessengerReceivedEvent {
  data: {
    event: 'message.received';
    message: IMessage;
  };
}
