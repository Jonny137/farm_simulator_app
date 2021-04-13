import {
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { FarmBuilding } from 'src/farm-buildings/farm-buildings.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AssignFarmUnitDto } from './dto/assign-farm-unit.dto';
import { CreateFarmUnitDto } from './dto/create-farm-unit.dto';
import { FarmUnit } from './farm-units.entity';

@EntityRepository(FarmUnit)
export class FarmUnitRepository extends Repository<FarmUnit> {
    private logger = new Logger('FarmUnitRepository');

    async findFarmUnitById(id: string) {
        const farmUnit = await this.findOne(id);

        if (!farmUnit) {
            throw new NotFoundException('Farm unit not found!');
        }

        return farmUnit;
    }

    async getAllAssignedUnits() {
        const query = this.createQueryBuilder('farm-unit');

        query.andWhere('farm-unit.farmBuildingId is not null');

        try {
            const farmUnits = await query.getMany();
            return farmUnits;
        } catch (error) {
            this.logger.error('Failed to fetch assigned and alive units.');
            throw new InternalServerErrorException();
        }
    }

    async createFarmUnit(createFarmUnit: CreateFarmUnitDto): Promise<FarmUnit> {
        const { type, farmBuildingId } = createFarmUnit;

        const farmUnit = new FarmUnit();
        farmUnit.type = type;
        farmUnit.farmBuildingId = farmBuildingId;
        farmUnit.health = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
        farmUnit.feedingInterval = new Date();

        try {
            await farmUnit.save();
        } catch (errr) {
            this.logger.error('Failed to create new farm unit.');
            console.log(errr);
            throw new InternalServerErrorException();
        }

        return farmUnit;
    }

    async assignFarmUnit(
        assignFarmUnitDto: AssignFarmUnitDto,
        farmBuilding: FarmBuilding,
    ): Promise<FarmUnit> {
        const { id } = assignFarmUnitDto;

        const farmUnit = await this.findFarmUnitById(id);

        if (farmBuilding.unitType !== farmUnit.type) {
            throw new HttpException(
                'Farm unit and building type missmatch.',
                HttpStatus.FORBIDDEN,
            );
        }

        farmUnit.feedingInterval = new Date();
        farmUnit.farmBuilding = farmBuilding;
        try {
            await farmUnit.save();
        } catch {
            this.logger.error('Failed to assign farm unit.');
            throw new InternalServerErrorException();
        }

        return farmUnit;
    }
}
