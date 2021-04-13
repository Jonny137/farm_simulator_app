import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { AssignFarmUnitDto } from './dto/assign-farm-unit.dto';
import { CreateFarmUnitDto } from './dto/create-farm-unit.dto';
import { FarmUnit } from './farm-units.entity';
import { FarmUnitsService } from './farm-units.service';

@Controller('farm-units')
export class FarmUnitsController {
    constructor(private farmUnitService: FarmUnitsService) {}

    @Get('/all')
    getAllFarmUnits(): Promise<FarmUnit[]> {
        return this.farmUnitService.getAllFarmUnits();
    }

    @Get('')
    getAllAssignedAliveUnits(): Promise<FarmUnit[]> {
        return this.farmUnitService.getAllAssignedUnits();
    }

    @Get('/:id')
    getFarmUnitById(@Param('id') id: string): Promise<FarmUnit> {
        return this.farmUnitService.getFarmUnitById(id);
    }

    @Post()
    createFarmUnit(
        @Body() createFarmUnitDto: CreateFarmUnitDto,
    ): Promise<FarmUnit> {
        return this.farmUnitService.createFarmUnit(createFarmUnitDto);
    }

    @Delete('/:id')
    deleteFarmUnitById(@Param('id') id: string): Promise<void> {
        return this.farmUnitService.deleteFarmUnitById(id);
    }

    @Put('/feed/:id')
    feedFarmUnit(@Param('id') id: string): Promise<FarmUnit> {
        return this.farmUnitService.feedFarmUnit(id);
    }

    @Put('/assign')
    addFarmUnitToFarmBuilding(
        @Body() assignFarmUnitDto: AssignFarmUnitDto,
    ): Promise<FarmUnit> {
        return this.farmUnitService.addFarmUnitToFarmBuilding(
            assignFarmUnitDto,
        );
    }
}
