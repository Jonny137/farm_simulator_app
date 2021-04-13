import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FarmUnit } from 'src/farm-units/farm-units.entity';
import { CreateFarmBuildingDto } from './dto/create-farm-building.dto';
import { GetFarmBuildingDto } from './dto/get-all-farm-buildings.dto';
import { FarmBuilding } from './farm-buildings.entity';
import { FarmBuildingsService } from './farm-buildings.service';

@Controller('farm-buildings')
export class FarmBuildingsController {
    constructor(private farmBuildingService: FarmBuildingsService) {}

    @Get()
    getAllFarmBuildings(): Promise<GetFarmBuildingDto[]> {
        return this.farmBuildingService.getAllFarmBuildings();
    }

    @Get('/:id')
    getFarmBuildingById(@Param('id') id: string): Promise<FarmBuilding> {
        return this.farmBuildingService.getFarmBuildingById(id);
    }

    @Get('/units/:id')
    getFarmBuildingUnitsById(@Param('id') id: string): Promise<FarmUnit[]> {
        return this.farmBuildingService.getFarmBuildingUnitsById(id);
    }

    @Post()
    createFarmBuilding(
        @Body() createFarmBuildingDto: CreateFarmBuildingDto,
    ): Promise<GetFarmBuildingDto> {
        return this.farmBuildingService.createFarmBuilding(
            createFarmBuildingDto,
        );
    }

    @Delete('/:id')
    deleteFarmBuldingById(@Param('id') id: string): Promise<void> {
        return this.farmBuildingService.deleteFarmBuildingById(id);
    }
}
