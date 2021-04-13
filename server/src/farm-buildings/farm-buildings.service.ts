import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmUnit } from 'src/farm-units/farm-units.entity';
import { CreateFarmBuildingDto } from './dto/create-farm-building.dto';
import { GetFarmBuildingDto } from './dto/get-all-farm-buildings.dto';
import { FarmBuilding } from './farm-buildings.entity';
import { FarmBuildingRepository } from './farm-buildings.repository';

@Injectable()
export class FarmBuildingsService {
    constructor(
        @InjectRepository(FarmBuildingRepository)
        private farmBuildingRepository: FarmBuildingRepository,
    ) {}

    async getAllFarmBuildings(): Promise<GetFarmBuildingDto[]> {
        const farmBuildings = await this.farmBuildingRepository.getAllFarmBuildings();

        return farmBuildings;
    }

    async getFarmBuildingById(id: string): Promise<FarmBuilding> {
        const farmBuilding = await this.farmBuildingRepository.findOne(id);

        if (!farmBuilding) {
            throw new NotFoundException('Farm building not found!');
        }

        return farmBuilding;
    }

    async getFarmBuildingUnitsById(id: string): Promise<FarmUnit[]> {
        const farmBuilding = await this.getFarmBuildingById(id);

        return farmBuilding.farmUnits;
    }

    async createFarmBuilding(
        createFarmBuildingDto: CreateFarmBuildingDto,
    ): Promise<GetFarmBuildingDto> {
        return this.farmBuildingRepository.createFarmBuilding(
            createFarmBuildingDto,
        );
    }

    async deleteFarmBuildingById(id: string): Promise<void> {
        const result = await this.farmBuildingRepository.delete({ id });

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }
}
