import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { CommonsModule } from 'src/common/commons.module';

@Module({
  imports: [NotificationModule, UserModule, CommonsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
