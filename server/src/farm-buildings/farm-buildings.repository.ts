import {
    ConflictException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { FarmUnit } from 'src/farm-units/farm-units.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateFarmBuildingDto } from './dto/create-farm-building.dto';
import { GetFarmBuildingDto } from './dto/get-all-farm-buildings.dto';
import { FarmBuilding } from './farm-buildings.entity';

@EntityRepository(FarmBuilding)
export class FarmBuildingRepository extends Repository<FarmBuilding> {
    private logger = new Logger('FarmBuildingRepository');

    async getAllFarmBuildings(): Promise<GetFarmBuildingDto[]> {
        const farmBuildings = await this.find();

        return farmBuildings.map((building: FarmBuilding) => {
            const { id, name, unitType, farmUnits } = building;
            const numOfUnits = farmUnits.length;
            const alive = farmUnits.filter((unit: FarmUnit) => unit.health > 0)
                .length;
            return {
                id,
                name,
                unitType,
                numOfUnits,
                alive,
                dead: numOfUnits - alive,
            };
        });
    }

    async createFarmBuilding(
        createFarmBuildingDto: CreateFarmBuildingDto,
    ): Promise<GetFarmBuildingDto> {
        const { name, unitType } = createFarmBuildingDto;

        const farmBuilding = new FarmBuilding();
        farmBuilding.name = name;
        farmBuilding.unitType = unitType;

        try {
            await farmBuilding.save();
        } catch (error) {
            if (error.errno === 1062) {
                this.logger.error('Duplicate entry not allowed.');
                throw new ConflictException(
                    `Farm building with the name ${name} already exists.`,
                    'Duplicate Entry',
                );
            } else {
                this.logger.error('Failed to create new farm building.');
                throw new InternalServerErrorException();
            }
        }

        return {
            id: farmBuilding.id,
            name: farmBuilding.name,
            unitType: farmBuilding.unitType,
            numOfUnits: 0,
            alive: 0,
            dead: 0,
        };
    }
}
