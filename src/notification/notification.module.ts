import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
  imports: [ConfigModule, MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const port = Number(config.get<number>('SMTP_PORT'));
      const isSecure = port === 465;

      return {
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: port,
          secure: isSecure,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
          // Remove conflicting TLS settings for now
          connectionTimeout: 30000, // Increased to 30 seconds
          greetingTimeout: 15000,   // 15 seconds for greeting
          socketTimeout: 30000,     // 30 seconds for socket operations
          logger: true,
          debug: true,
        },
        defaults: {
          from: `"BertAndre" <${config.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: join(process.cwd(), 'src', 'notification', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    }
  }),]
})
export class NotificationModule { }
