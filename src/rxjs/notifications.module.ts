import { DynamicModule, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationModule {
  static forRoot(config: any): DynamicModule {
    return {
      module: NotificationModule,
      providers: [
        {
          provide: 'NOTIFICATION_CONFIG',
          useValue: config,
        },
        NotificationsService,
      ],
      exports: [NotificationsService],
    };
  }
}
