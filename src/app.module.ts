import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FoldersModule } from './folders/folders.module';
import { FilesModule } from './files/files.module';
import { PermissionModule } from './permission/permission.module';
import { AuditModule } from './audit/audit.module';
import { NotificationModule } from './notification/notification.module';
import { TeamModule } from './team/team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonsModule } from './common/commons.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    CommonsModule,
    AuthModule,
    UserModule,
    FoldersModule,
    FilesModule,
    PermissionModule,
    AuditModule,
    NotificationModule,
    TeamModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('LOCAL_POSTGRES_HOST', 'localhost'),
        port: parseInt(config.get<string>('LOCAL_POSTGRES_PORT', '5432'), 10),
        username: config.get<string>('LOCAL_POSTGRES_USER', 'postgres'),
        password: config.get<string>('LOCAL_POSTGRES_PASSWORD', ''),
        database: config.get<string>('LOCAL_POSTGRES_DB', 'app_db'),
        entities: [__dirname + '/**/entities/*{.ts,.js}'],
        synchronize: true,
        logging: config.get<string>('DB_LOGGING') === 'true',
        // ssl: {
        //   rejectUnauthorized: config.get<string>('LOCAL_DB_SSL') === 'false', // allows self-signed certs
        // },

      }),
    }),
    FileStorageModule,
    ShareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }  
