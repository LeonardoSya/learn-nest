import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { Notification, NotificationsService } from './notifications.service';
import { map, Observable } from 'rxjs';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // 普通的post端点
  @Post()
  sendNotification(@Body() notification: Notification) {
    this.notificationsService.sendNotification(notification);
    return { success: true };
  }

  // sse端点 实时获取用户通知
  @Sse('stream/:userId')
  streamNotifications(
    @Param('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.notificationsService.getUserNotifications(userId).pipe(
      map(
        (notic) =>
          ({
            data: notic, // 实际发送的数据
            type: 'notification', // 事件类型
            id: notic.id,
          }) as unknown as MessageEvent,
      ),
    );
  }

  // sse端点 系统更新流
  @Sse('system-updates/:userId')
  streamSystemUpdates(
    @Param('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.notificationsService.startSystemUpdates(userId).pipe(
      map(
        (notic) =>
          ({
            data: notic,
            type: 'system-update',
            id: notic.id,
          }) as unknown as MessageEvent,
      ),
    );
  }
}
