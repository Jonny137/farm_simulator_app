import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmBuildingsModule } from './farm-buildings/farm-buildings.module';
import { FarmUnitsModule } from './farm-units/farm-units.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_TCP_PORT) || 3306,
                username: process.env.MYSQL_USERNAME,
                password: process.env.MYSQL_ROOT_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
        }),
        FarmBuildingsModule,
        FarmUnitsModule,
        ScheduleModule.forRoot(),
        EventsModule,
    ],
    providers: [CronService],
})
export class AppModule {}
