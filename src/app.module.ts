import { Module } from '@nestjs/common';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdapterModule } from './adapter/adapter.module';
import { HttpExceptionFilter } from './adapter/exception/http-exception.handler';
import { SchedulerServiceModule } from './infrastructure/scheduler/scheduler-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    PersistenceModule,
    AdapterModule,
    SchedulerServiceModule,
  ],
  controllers: [],
  providers: [HttpExceptionFilter],
})
export class AppModule {}
