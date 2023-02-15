import { Notification } from '../entities';

export type NotificationSqlRawUnsafe = Omit<Notification, 'user' | 'topic'>;
export type NotificationSqlRaw = Partial<NotificationSqlRawUnsafe>;
