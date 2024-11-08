import { Injectable } from '@nestjs/common';
import { filter, interval, map, Observable, Subject } from 'rxjs';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
}

@Injectable()
export class NotificationsService {
  private notifications$ = new Subject<Notification>(); // $表示这个变量是一个Observable
  private systemUpdates$ = interval(5000);

  // 发送通知
  sendNotification(notification: Notification) {
    this.notifications$.next(notification);
  }

  // 获取特定用户的通知流
  getUserNotifications(userId: string): Observable<Notification> {
    return this.notifications$.pipe(
      filter((notification) => notification.userId === userId),
    );
  }

  // 获取特定类型的通知
  getNotificationByType(
    type: 'info' | 'warning' | 'error',
  ): Observable<Notification> {
    return this.notifications$.pipe(
      filter((notification) => notification.type === type),
    );
  }

  // 模拟系统更新通知
  startSystemUpdates(userId: string): Observable<Notification> {
    return this.systemUpdates$.pipe(
      map((count: any) => ({
        id: `sys-${count}`,
        userId,
        message: `系统更新 #${count}`,
        type: 'info',
        timestamp: new Date(),
      })),
    );
  }
}
