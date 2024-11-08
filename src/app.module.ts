import { Module } from '@nestjs/common';
import { NotificationModule } from './rxjs/notifications.module';

@Module({
  imports: [
    NotificationModule.forRoot({ updateInterval: 5000, maxNotifications: 100 }),
  ],
})
export class AppModule {}
