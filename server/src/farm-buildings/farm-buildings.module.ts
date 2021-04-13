import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmBuildingsController } from './farm-buildings.controller';
import { FarmBuildingRepository } from './farm-buildings.repository';
import { FarmBuildingsService } from './farm-buildings.service';

@Module({
    imports: [TypeOrmModule.forFeature([FarmBuildingRepository])],
    controllers: [FarmBuildingsController],
    providers: [FarmBuildingsService],
    exports: [FarmBuildingsService],
})
export class FarmBuildingsModule {}
