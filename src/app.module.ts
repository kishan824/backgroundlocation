import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    // ✅ Global config
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');

        console.log('DB URL:', dbUrl); // ✅ debug (check in logs)

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true,

          // 🔥 REQUIRED for Render
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),

    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
