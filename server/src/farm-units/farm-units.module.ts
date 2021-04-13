import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmBuildingsModule } from 'src/farm-buildings/farm-buildings.module';
import { FarmUnitsController } from './farm-units.controller';
import { FarmUnitRepository } from './farm-units.repository';
import { FarmUnitsService } from './farm-units.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FarmUnitRepository]),
        FarmBuildingsModule,
    ],
    controllers: [FarmUnitsController],
    providers: [FarmUnitsService],
    exports: [FarmUnitsService],
})
export class FarmUnitsModule {}
