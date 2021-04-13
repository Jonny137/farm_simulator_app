import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppGateway } from 'src/events/events.gateway';
import { FarmUnit } from 'src/farm-units/farm-units.entity';
import { FarmUnitsService } from 'src/farm-units/farm-units.service';

@Injectable()
export class CronService {
    private logger = new Logger('CronService');

    constructor(
        private readonly farmUnitService: FarmUnitsService,
        private readonly gateway: AppGateway,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handlFarmFeeding() {
        const farmUnits = await this.farmUnitService.getAllAssignedUnits();
        let farmUnitUpdated = false;

        farmUnits.forEach(async (farmUnit: FarmUnit) => {
            if (
                farmUnit.health === 0 ||
                (farmUnit.lastFed &&
                    Date.now() - farmUnit.lastFed.getTime() < 5000)
            ) {
                return;
            }

            farmUnitUpdated = true;

            farmUnit.health += Math.floor((100 - farmUnit.health) / 2);
            farmUnit.lastFed = new Date();
            farmUnit.feedingInterval = new Date();
            try {
                await farmUnit.save();
            } catch (error) {
                this.logger.error('Failed to update farm unit stats.');
            }
        });

        if (farmUnitUpdated) {
            this.gateway.server.emit('healthUpdate', farmUnits);
        }
    }

    @Cron(CronExpression.EVERY_SECOND)
    async handleHealthReduction() {
        const farmUnits = await this.farmUnitService.getAllAssignedUnits();
        let farmUnitUpdated = false;

        farmUnits.forEach(async (farmUnit: FarmUnit) => {
            if (
                farmUnit.health === 0 ||
                Date.now() - farmUnit.feedingInterval.getTime() < 10000
            ) {
                return;
            }

            farmUnitUpdated = true;

            farmUnit.health -= 1;
            farmUnit.feedingInterval = new Date();
            try {
                await farmUnit.save();
            } catch (error) {
                this.logger.error('Failed to reduce farm unit health.');
            }
        });

        if (farmUnitUpdated) {
            this.gateway.server.emit('healthUpdate', farmUnits);
        }
    }
}
