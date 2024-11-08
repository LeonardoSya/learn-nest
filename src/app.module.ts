import { Module } from '@nestjs/common';
import { NotificationModule } from './rxjs/notifications.module';

@Module({
  imports: [NotificationModule],
})
export class AppModule {}
