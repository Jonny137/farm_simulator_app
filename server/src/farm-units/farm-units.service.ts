import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FarmBuildingsService } from 'src/farm-buildings/farm-buildings.service';
import { AssignFarmUnitDto } from './dto/assign-farm-unit.dto';
import { CreateFarmUnitDto } from './dto/create-farm-unit.dto';
import { FarmUnit } from './farm-units.entity';
import { FarmUnitRepository } from './farm-units.repository';

@Injectable()
export class FarmUnitsService {
    private logger = new Logger('FarmUnitsService');

    constructor(
        @InjectRepository(FarmUnitRepository)
        private readonly farmUnitRepository: FarmUnitRepository,
        private readonly farmBuildingsService: FarmBuildingsService,
    ) {}

    async getAllFarmUnits(): Promise<FarmUnit[]> {
        return await this.farmUnitRepository.find();
    }

    async getAllAssignedUnits(): Promise<FarmUnit[]> {
        return await this.farmUnitRepository.getAllAssignedUnits();
    }

    async getFarmUnitById(id: string): Promise<FarmUnit> {
        return await this.farmUnitRepository.findFarmUnitById(id);
    }

    async createFarmUnit(
        createFarmUnitDto: CreateFarmUnitDto,
    ): Promise<FarmUnit> {
        return this.farmUnitRepository.createFarmUnit(createFarmUnitDto);
    }

    async deleteFarmUnitById(id: string): Promise<void> {
        const result = await this.farmUnitRepository.delete({ id });

        if (result.affected === 0) {
            throw new NotFoundException();
        }
    }

    async feedFarmUnit(id: string): Promise<FarmUnit> {
        const farmUnit = await this.getFarmUnitById(id);

        if (farmUnit.health === 0) {
            throw new HttpException('Farm unit is dead.', HttpStatus.FORBIDDEN);
        }

        if (
            farmUnit.lastFed &&
            Date.now() - farmUnit.lastFed.getTime() < 5000
        ) {
            throw new HttpException(
                'This farm unit has been fed less than 5 seconds ago.',
                HttpStatus.FORBIDDEN,
            );
        }

        farmUnit.lastFed = new Date();
        farmUnit.feedingInterval = new Date();
        if (farmUnit.health < 100) {
            farmUnit.health += 1;
        }

        try {
            await farmUnit.save();
        } catch {
            this.logger.error('Failed to feed the unit.');
            throw new InternalServerErrorException();
        }

        return farmUnit;
    }

    async addFarmUnitToFarmBuilding(
        assignFarmUnitDto: AssignFarmUnitDto,
    ): Promise<FarmUnit> {
        const { buildingId } = assignFarmUnitDto;

        const farmBuilding = await this.farmBuildingsService.getFarmBuildingById(
            buildingId,
        );

        return this.farmUnitRepository.assignFarmUnit(
            assignFarmUnitDto,
            farmBuilding,
        );
    }
}
